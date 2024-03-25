import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TuiActiveZoneDirective, TuiLetModule, TuiObscuredDirective} from '@taiga-ui/cdk';
import {
    TuiDropdownModule,
    TuiDropdownOptionsDirective,
} from '@taiga-ui/core/directives/dropdown';
import {PolymorpheusModule} from '@tinkoff/ng-polymorpheus';

import {TuiAccessorProxyDirective} from './accessor-proxy.directive';
import {TuiDropdownOpenMonitorDirective} from './dropdown-open-monitor.directive';
import {TuiHostedDropdownComponent} from './hosted-dropdown.component';
import {TuiHostedDropdownConnectorDirective} from './hosted-dropdown-connector.directive';

/**
 * @deprecated use {@link TuiDropdownOpenDirective} instead
 */
@NgModule({
    imports: [
        CommonModule,
        PolymorpheusModule,
        TuiLetModule,
        TuiObscuredDirective,
        TuiActiveZoneDirective,
        TuiDropdownModule,
    ],
    declarations: [
        TuiAccessorProxyDirective,
        TuiDropdownOpenMonitorDirective,
        TuiHostedDropdownComponent,
        TuiHostedDropdownConnectorDirective,
    ],
    exports: [
        TuiHostedDropdownComponent,
        TuiHostedDropdownConnectorDirective,
        TuiDropdownOptionsDirective,
    ],
})
export class TuiHostedDropdownModule {}
