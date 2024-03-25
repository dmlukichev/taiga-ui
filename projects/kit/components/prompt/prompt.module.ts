import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TuiAutoFocusDirective} from '@taiga-ui/cdk';
import {TuiButtonModule} from '@taiga-ui/core';
import {PolymorpheusModule} from '@tinkoff/ng-polymorpheus';

import {TuiPromptComponent} from './prompt.component';

@NgModule({
    imports: [CommonModule, PolymorpheusModule, TuiButtonModule, TuiAutoFocusDirective],
    declarations: [TuiPromptComponent],
    exports: [TuiPromptComponent],
})
export class TuiPromptModule {}
