import "reflect-metadata";
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { AppShell } from './admin/appShell';
import { CustomThemeProvider } from './admin/themeProvider';

import './admin/scss/custom.scss';

render(() => (
    <CustomThemeProvider>
        <Router>
            <AppShell />
        </Router>
    </CustomThemeProvider>
),
    document.getElementById('social-admin') as HTMLElement
);