import type {UpdateRecorder} from '@angular-devkit/schematics';
import type {DevkitFileSystem} from 'ng-morph';
import {arrayFlat} from 'ng-morph';
import type {Attribute} from 'parse5/dist/common/token';
import type {Element} from 'parse5/dist/tree-adapters/default';

import {
    findElementsByFn,
    findElementsByTagNames,
    hasElementAttribute,
} from '../../../utils/templates/elements';
import {getInputPropertyOffsets} from '../../../utils/templates/ng-component-input-manipulations';
import {
    getTemplateFromTemplateResource,
    getTemplateOffset,
} from '../../../utils/templates/template-resource';
import type {TemplateResource} from '../../interfaces/template-resource';

const TEXTFIELDS = [
    'tui-input',
    'tui-primitive-textfield',
    'tui-text-area',
    'tui-combo-box',
    'tui-input-copy',
    'tui-input-date',
    'tui-input-date-range',
    'tui-input-date-time',
    'tui-input-number',
    'tui-input-password',
    'tui-input-count',
    'tui-input-number',
    'tui-input-phone',
    'tui-input-slider',
    'tui-input-card',
];

const ATTRS_MAP: Record<string, string> = {
    tuitextfieldautocomplete: 'autocomplete',
    tuitextfieldinputmode: 'inputmode',
    tuitextfieldmaxlength: 'maxlength',
    tuitextfieldtype: 'type',
    tuitextfieldexampletext: 'placeholder',
    '[tuitextfieldautocomplete]': '[attr.autocomplete]',
    '[tuitextfieldinputmode]': '[attr.inputmode]',
    '[tuitextfieldmaxlength]': '[attr.maxlength]',
    '[tuitextfieldtype]': '[attr.type]',
    '[tuitextfieldexampletext]': '[attr.placeholder]',
};

const CONTROLLER_ITEMS = Object.keys(ATTRS_MAP).map((attr) => attr.toLowerCase());

function insertTuiTextfieldInput({
    element,
    attrs,
    recorder,
    templateOffset,
}: {
    attrs: Attribute[];
    element: Element;
    recorder: UpdateRecorder;
    templateOffset: number;
}): void {
    const newAttrs = attrs
        .map((attr) => `${ATTRS_MAP[attr.name]}="${attr.value}"`)
        .join('\n');
    const content =
        element.tagName === 'tui-text-area'
            ? `<textarea tuiTextfield ${newAttrs}></textarea> `
            : `<input tuiTextfield ${newAttrs}/> `;

    const insertTo = element.sourceCodeLocation?.endTag?.startOffset;

    if (insertTo) {
        recorder.insertRight(insertTo + templateOffset, content);
    }
}

function addAttrToExistingInput({
    existingInput,
    attrs,
    recorder,
    templateOffset,
}: {
    attrs: Attribute[];
    existingInput: Element;
    recorder: UpdateRecorder;
    templateOffset: number;
}): void {
    attrs.forEach((attr) => {
        const insertTo = existingInput.sourceCodeLocation?.attrs?.tuitextfield?.endOffset;

        if (insertTo) {
            recorder.insertLeft(
                insertTo + templateOffset,
                ` ${ATTRS_MAP[attr.name]}="${attr.value}"`,
            );
        }
    });
}

function removeOldInputs(
    recorder: UpdateRecorder,
    template: string,
    templateOffset: number,
): void {
    const offsets = arrayFlat(
        CONTROLLER_ITEMS.map((item) =>
            getInputPropertyOffsets(template, item, getTagsToRemove(item)),
        ),
    );

    offsets.forEach(([start, end]) => {
        recorder.remove(start + templateOffset, end - start);
    });
}

function getTagsToRemove(attrName: string): string[] {
    return ['[tuitextfieldmaxlength]', 'tuitextfieldmaxlength'].includes(attrName)
        ? TEXTFIELDS.filter((tag) => tag !== 'tui-text-area')
        : TEXTFIELDS;
}

const excludedAttrs: Record<string, string[]> = {
    'tui-text-area': ['[tuitextfieldmaxlength]', 'tuitextfieldmaxlength'],
};

function exclusion({tagName}: Element, attrName: string): boolean {
    return excludedAttrs[tagName]?.includes(attrName);
}

export function migrateTextfieldController({
    resource,
    fileSystem,
    recorder,
}: {
    fileSystem: DevkitFileSystem;
    recorder: UpdateRecorder;
    resource: TemplateResource;
}): void {
    const template = getTemplateFromTemplateResource(resource, fileSystem);
    const templateOffset = getTemplateOffset(resource);

    const elements = findElementsByTagNames(template, TEXTFIELDS);

    elements.forEach((element) => {
        const attrs = element.attrs.filter(
            (attr) =>
                CONTROLLER_ITEMS.includes(attr.name) && !exclusion(element, attr.name),
        );

        if (!attrs.length) {
            return;
        }

        const existingInput = findElementsByFn(
            element.childNodes,
            (el) =>
                (el.tagName === 'input' || el.tagName === 'textarea') &&
                hasElementAttribute(el, 'tuiTextfield'),
        )[0];

        if (existingInput) {
            addAttrToExistingInput({existingInput, attrs, recorder, templateOffset});
        } else {
            insertTuiTextfieldInput({element, attrs, recorder, templateOffset});
        }
    });

    removeOldInputs(recorder, template, templateOffset);
}
