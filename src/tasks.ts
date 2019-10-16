// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, Disposable } from 'vscode';
import { QuickPickItem, QuickInputButton, Uri} from 'vscode';
import * as asana from 'asana';
import config from './config';
import { getAsanaApiToken } from './token';
import { getDefaultWorkspace }  from './workspace';


class SearchButton implements QuickInputButton {
	static _iconPath: { light: Uri; dark: Uri; };
	static init(context: vscode.ExtensionContext) {
		SearchButton._iconPath = {
			light: Uri.file(context.asAbsolutePath('images/light/search.svg')),
			dark: Uri.file(context.asAbsolutePath('images/dark/search.svg')),
		};
	}
	public iconPath: { light: Uri; dark: Uri; };
	public tooltip: string;
	constructor() {
		this.iconPath = SearchButton._iconPath;
		this.tooltip ='Search all tasks';
	 }
}


class AsanaTaskItem implements QuickPickItem {

	label: string;
	description: string;
	detail: string;

	constructor(public asanaTask: asana.resources.Tasks.Type) {
		this.label = asanaTask.name;
		this.description = asanaTask.gid.toString();
		const sections = asanaTask.memberships
			.map((e: asana.resources.Membership):string|null => e.section ? e.section.name: null)
			.filter((e: string|null) => !!e).join(', ');
		this.detail = (sections ? '[' + sections + '] ' : '') + asanaTask.projects.map((e: asana.resources.Resource) => e.name).join(', ');
	}
}


async function fetchAsanaTasks(personalAccessToken: string , workspaceId: string, searchText: null | string = null): Promise<asana.resources.Tasks.Type[] | null>{
  // Construct an Asana client
	const client = asana.Client.create().useAccessToken(personalAccessToken);
	const searchParams: any = {
		completed: false,
		opt_fields: "name, memberships.section.name, projects.name",
	};
	if(!searchText){
		if (config.getSearchAssignedToMeOnly()){
			searchParams['assignee.any'] = 'me';
		} else {
			searchParams['followers.any'] = 'me';
		}

		const selectedProjects = config.getSelectedProjects();
		if(selectedProjects.length){
			searchParams['projects.any'] = selectedProjects.join(',')
		}
	} else {
		searchParams['text'] = searchText;
	}

	const result = await client.tasks.dispatchGet(`/workspaces/${workspaceId}/tasks/search`, searchParams);
	return result;
}


export
async function pickTask() {
	// Prefetch token and workspaceid, so that quickpicks don't mess in each other
	const personalAccessToken = await getAsanaApiToken();
	const workspaceId:any = await getDefaultWorkspace();

	const disposables: Disposable[] = [];
	try {
		let result = await new Promise<AsanaTaskItem | undefined>(async (resolve, reject) => {
			const input = window.createQuickPick<AsanaTaskItem>();
			const populateAsanaTasks = async () =>{
				input.placeholder = 'Fetching asana tasks...';
				input.busy = true;
				input.items = [];
				const tasks = await fetchAsanaTasks(personalAccessToken, workspaceId, input.value);
				if(tasks){
					input.items = tasks.map(e => new AsanaTaskItem(e))
					input.placeholder = 'Select asana task...';
					input.busy = false;
					input.buttons = [new SearchButton()];
				} else {
					vscode.window.showErrorMessage('[Asana]Failed to fetch task list');
				}
			}
			disposables.push(
				input.onDidChangeSelection(selection => {
					resolve(selection[0]);
					input.hide();

				}),
				input.onDidHide(() => input.dispose()),
				input.onDidTriggerButton((button)=>{
					if(button instanceof SearchButton){
						populateAsanaTasks();
					}
				})
			);
			input.show();
			populateAsanaTasks();
		});
		return result;
	} finally {
		disposables.forEach(d => d.dispose());
	}
}


export
function initialize(context: vscode.ExtensionContext) {
	SearchButton.init(context);
}