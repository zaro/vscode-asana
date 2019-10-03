import * as vscode from 'vscode';

export
class ExtConfig {
    API_TOKEN = 'asana.apiToken';
    WORKSPACE_ID = 'asana.workspaceId';
    SELECTED_PROJECTS = 'asana.selectedProjects';
    PREPEND_STRING_TO_TASK_ID = 'asana.prependStringToTaskNumber';
    SEARCH_ASSIGNED_OR_FOLLOWED = 'asana.searchAssignedToMeOnly';

    getConfigurationTarget(): vscode.ConfigurationTarget {
        return vscode.workspace.name === undefined ? vscode.ConfigurationTarget.Global:  vscode.ConfigurationTarget.Workspace;
    }

    getKey<T>(key: string, defaultsTo: T): T {
        const configuration = vscode.workspace.getConfiguration();
        return configuration.get<T>(key) || defaultsTo;
    }

    setKey<T>(key: string, value: T): Thenable<void> {
        const configuration = vscode.workspace.getConfiguration();
        return configuration.update(key, value, this.getConfigurationTarget());
    }

    getApiToken(): string | undefined{
        return this.getKey<string | undefined>(this.API_TOKEN, undefined);
    }

    setApiToken(value: string): Thenable<void> {
        return this.setKey<string>(this.API_TOKEN, value);
    }

    getWorkspaceId(): string | undefined {
        return this.getKey<string | undefined>(this.WORKSPACE_ID, undefined);
    }

    setWorkspaceId(value: string): Thenable<void> {
        return this.setKey<string>(this.WORKSPACE_ID, value);
    }

    getSelectedProjects(): string[] {
        return this.getKey<string[]>(this.SELECTED_PROJECTS, []);
    }

    setSelectedProjects(value: string[]): Thenable<void> {
        return this.setKey<string[]>(this.SELECTED_PROJECTS, value);
    }

    getPrependStringToTaskId(): string {
        return this.getKey<string>(this.PREPEND_STRING_TO_TASK_ID, '');
    }

    setPrependStringToTaskId(value: string): Thenable<void> {
        return this.setKey<string>(this.PREPEND_STRING_TO_TASK_ID, value);
    }

    getSearchAssignedToMeOnly(): boolean {
        return this.getKey<boolean>(this.SEARCH_ASSIGNED_OR_FOLLOWED, false);
    }

    setSearchAssignedToMeOnly(value: boolean): Thenable<void> {
        return this.setKey<boolean>(this.SEARCH_ASSIGNED_OR_FOLLOWED, value);
    }

}

const config  = new ExtConfig();

export default config;
