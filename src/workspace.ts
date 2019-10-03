// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, Disposable } from 'vscode';
import { QuickPickItem } from 'vscode';
import * as asana from 'asana';
import { getAsanaApiToken } from './token';
import config from './config';


class AsanaWorkspaceItem implements QuickPickItem {

	label: string;
	description: string;

	constructor(public asanaWorkspace: any) {
		this.label = asanaWorkspace.name;
		this.description = asanaWorkspace.name;
	}
}


async function fetchAsanaWorskpaces(): Promise<asana.resources.Resource[]>{
    const personalAccessToken = await getAsanaApiToken();

    // Construct an Asana client
    const client = asana.Client.create().useAccessToken(personalAccessToken);

	// Get your user info
    const result = await client.users.me();
    return result.workspaces;
}



async function pickWorkspace() {
	const disposables: Disposable[] = [];
	try {
		return await new Promise<AsanaWorkspaceItem | undefined>(async (resolve, reject) => {
			const input = window.createQuickPick<AsanaWorkspaceItem>();
			input.placeholder = 'Fetching asana workspaces...';
			input.busy = true;
			disposables.push(
				input.onDidChangeSelection(selection => {
					resolve(selection[0]);
					input.hide();

				}),
				input.onDidHide(() => input.dispose())
			);
			input.show();
			const tasks = await fetchAsanaWorskpaces();
			input.items = tasks.map(e => new AsanaWorkspaceItem(e))
			input.placeholder = 'Select asana workspace...';
			input.busy = false;
		});
	} finally {
		disposables.forEach(d => d.dispose());
	}
}

export
async function getDefaultWorkspace() : Promise<string> {
    let workspaceId = config.getWorkspaceId()
    if(!workspaceId){
        const result = await pickWorkspace();
        if(result){
			workspaceId = result.asanaWorkspace.gid;
			if(workspaceId){
				await config.setWorkspaceId(workspaceId);
			}
        }
    }
    if(!workspaceId){
        throw  Error('Please select default Asana workspace');
    }
    return workspaceId;
}