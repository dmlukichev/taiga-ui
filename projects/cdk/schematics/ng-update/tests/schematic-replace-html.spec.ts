import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';

import {
    createProject,
    createSourceFile,
    resetActiveProject,
    saveActiveProject,
    setActiveProject,
} from 'ng-morph';
import {join} from 'path';

const collectionPath = join(__dirname, '../../migration.json');

const COMPONENT_WITH_TEMPLATE_URL = `
@Component({templateUrl: './test.template.html'})
export class TestComponent {}
`;

const TEMPLATE_BEFORE = `
<thead>
        <tr tuiThGroup>
            <th
                tuiResizableColumn
            >
                Name
            </th>
            <th tuiTh>Balance</th>
        </tr>
</thead>
<tui-editor new [formControl]="control"></tui-editor>
<tui-editor new [formControl]="control"></tui-editor>
<tui-group class="some_class">
    <div class="content"></div>
</tui-group>

<tui-wrapper
    [appearance]="appearance"
    [disabled]="computedDisabled"
    [focused]="computedFocusVisible"
    [hovered]="computedHovered"
    [pressed]="computedPressed"
    [invalid]="computedInvalid"
>any</tui-wrapper>

<tui-primitive-textfield
    (autofilledChange)="onAutofilledChange($event)">
</tui-primitive-textfield>

<div tuiWrapper
    [hovered]="computedHovered"
>any</div>

<tui-select (hoveredChange)="onHoverChange(event$)"></tui-select>
<button tuiButton (pressedChange)="onPressChange($event)"></button>
`;

const TEMPLATE_AFTER = `
<thead>
        <tr tuiThGroup>
            <th
                tuiTh [resizable]="true"
            >
                Name
            </th>
            <th tuiTh>Balance</th>
        </tr>
</thead>
<tui-editor [formControl]="control"></tui-editor>
<tui-editor [formControl]="control"></tui-editor>
<div tuiGroup class="some_class">
    <div class="content"></div>
</div>

<div tuiWrapper
    [appearance]="appearance"
    [disabled]="computedDisabled"
    [focused]="computedFocusVisible"
    [hover]="computedHovered"
    [active]="computedPressed"
    [invalid]="computedInvalid"
>any</div>

<tui-primitive-textfield
    (tuiAutofilledChange)="onAutofilledChange($event)">
</tui-primitive-textfield>

<div tuiWrapper
    [hover]="computedHovered"
>any</div>

<tui-select (tuiHoveredChange)="onHoverChange(event$)"></tui-select>
<button tuiButton (tuiPressedChange)="onPressChange($event)"></button>
`;

const COMPONENT_BEFORE = `
@Component({template: '<tui-group><div></div></tui-group>'})
export class TestComponentInline {
    aware = TUI_MOBILE_AWARE;
}
`;

const COMPONENT_AFTER = `
@Component({template: '<div tuiGroup><div></div></div>'})
export class TestComponentInline {
    aware = TUI_MOBILE_AWARE;
}
`;

const MODULE_BEFORE = `
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {TestComponentInline} from './test-inline.component';
import {TestComponent} from './test.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TestComponent,
        TestComponentInline
    ],
    exports: [TestComponent],
})
export class ExampleModule {}
`;

const MODULE_AFTER = `import { TuiAutofilledModule, TuiPressedModule, TuiHoveredModule } from "@taiga-ui/cdk";

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {TestComponentInline} from './test-inline.component';
import {TestComponent} from './test.component';

@NgModule({
    imports: [
        CommonModule,
        TuiAutofilledModule,
        TuiPressedModule,
        TuiHoveredModule
    ],
    declarations: [
        TestComponent,
        TestComponentInline
    ],
    exports: [TestComponent],
})
export class ExampleModule {}
`;

describe('ng-update', () => {
    let host: UnitTestTree;
    let runner: SchematicTestRunner;

    beforeEach(() => {
        host = new UnitTestTree(new HostTree());
        runner = new SchematicTestRunner('schematics', collectionPath);

        setActiveProject(createProject(host));

        createMainFiles();

        saveActiveProject();
    });

    it('should edit templates', async () => {
        const tree = await runner.runSchematicAsync('updateToV3', {}, host).toPromise();

        expect(tree.readContent('test/app/test.template.html')).toEqual(TEMPLATE_AFTER);
    });

    it('should add directive to module', async () => {
        const tree = await runner.runSchematicAsync('updateToV3', {}, host).toPromise();

        expect(tree.readContent('test/app/test.module.ts')).toEqual(MODULE_AFTER);
    });

    it('should edit inline templates', async () => {
        const tree = await runner.runSchematicAsync('updateToV3', {}, host).toPromise();

        expect(tree.readContent('test/app/test-inline.component.ts')).toEqual(
            COMPONENT_AFTER,
        );
    });

    afterEach(() => {
        resetActiveProject();
    });
});

function createMainFiles(): void {
    createSourceFile('test/app/test.component.ts', COMPONENT_WITH_TEMPLATE_URL);

    createSourceFile('test/app/test.template.html', TEMPLATE_BEFORE);

    createSourceFile('test/app/test-inline.component.ts', COMPONENT_BEFORE);

    createSourceFile('test/app/test.module.ts', MODULE_BEFORE);
}
