// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, Disposable } from 'vscode';
import { QuickPickItem } from 'vscode';
import * as asana from 'asana';
import { getAsanaApiToken } from './token';
import { getDefaultWorkspace } from './workspace';

const CONFIG_KEY = 'asana.selectedProjects';


class AsanaProjectItem implements QuickPickItem {

	label: string;
	description: string;

	constructor(public asanaProject: any) {
		this.label = asanaProject.name;
		this.description = asanaProject.name;
	}
}


async function fetchAsanaProjects(personalAccessToken: string , workspaceId: string): Promise<asana.resources.Projects.Type[]>{
    // Construct an Asana client
    const client = asana.Client.create().useAccessToken(personalAccessToken);

	// Get your user info
	const result = await client.projects.findByWorkspace(Number(workspaceId))
	return result.data;
}


export
async function pickProjects() {
	const personalAccessToken = await getAsanaApiToken();
	const workspaceId:any = await getDefaultWorkspace();

	const disposables: Disposable[] = [];
	try {
		return await new Promise<AsanaProjectItem[] | undefined>(async (resolve, reject) => {
			const input = window.createQuickPick<AsanaProjectItem>();
			input.placeholder = 'Fetching asana projects...';
			input.busy = true;
			input.canSelectMany = true;
			let selectedProjects:AsanaProjectItem[] = [];
			disposables.push(
				input.onDidAccept(() => {
					resolve(selectedProjects);
					input.hide();

				}),
				input.onDidChangeSelection(selection => {
					selectedProjects = selection;

				}),
				input.onDidHide(() => input.dispose())
			);
			input.show();
			const tasks = await fetchAsanaProjects(personalAccessToken, workspaceId);
			input.items = tasks.map(e => new AsanaProjectItem(e))
			input.placeholder = 'Select asana projects...';
			input.busy = false;
		});
	} finally {
		disposables.forEach(d => d.dispose());
	}
}
