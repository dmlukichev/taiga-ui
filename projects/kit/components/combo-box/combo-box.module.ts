import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TuiActiveZoneDirective} from '@taiga-ui/cdk';
import {
    TuiHostedDropdownModule,
    TuiPrimitiveTextfieldModule,
    TuiTextfieldComponent,
    TuiTextfieldControllerModule,
    TuiWrapperModule,
} from '@taiga-ui/core';
import {TuiArrowModule} from '@taiga-ui/kit/components/arrow';
import {TuiSelectOptionModule} from '@taiga-ui/kit/components/select-option';
import {PolymorpheusModule} from '@tinkoff/ng-polymorpheus';

import {TuiComboBoxComponent} from './combo-box.component';
import {TuiComboBoxDirective} from './combo-box.directive';
import {TuiComboBoxStrictDirective} from './combo-box-strict.directive';

@NgModule({
    imports: [
        CommonModule,
        PolymorpheusModule,
        TuiActiveZoneDirective,
        TuiPrimitiveTextfieldModule,
        TuiHostedDropdownModule,
        TuiSelectOptionModule,
        TuiArrowModule,
        TuiWrapperModule,
        TuiTextfieldControllerModule,
    ],
    declarations: [
        TuiComboBoxComponent,
        TuiComboBoxStrictDirective,
        TuiComboBoxDirective,
    ],
    exports: [
        TuiComboBoxComponent,
        TuiComboBoxStrictDirective,
        TuiComboBoxDirective,
        TuiTextfieldComponent,
    ],
})
export class TuiComboBoxModule {}
