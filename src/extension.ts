// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import config from './config';
import { pickTask, initialize } from './tasks';
import { pickProjects}  from './projects';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	initialize(context);

	let disposable1 = vscode.commands.registerCommand('extension.asanaCopyTaskId', async () => {
		// The code you place here will be executed every time your command is executed
		const task  = await pickTask();
		if(task){
			let prepend = config.getPrependStringToTaskId()

			vscode.env.clipboard.writeText(`${prepend}${task.asanaTask.id}`)
			// Display a message box to the user
			vscode.window.showInformationMessage('Task Id copied to clipboard');
		}
	});
	context.subscriptions.push(disposable1);

	let disposable2 = vscode.commands.registerCommand('extension.asanaCopyTaskURL', async () => {
		// The code you place here will be executed every time your command is executed
		const task  = await pickTask();
		if(task){
			const selectedProjects = config.getSelectedProjects();
			let urlProjectId = '0';
			for(const projectId of selectedProjects){
				for(const taskProject of task.asanaTask.projects){
					if(projectId === taskProject.id.toString()){
						urlProjectId = projectId;
						break;
					}
				}
				if(urlProjectId !== '0'){
					break;
				}
			}
			vscode.env.clipboard.writeText(`https://app.asana.com/0/${urlProjectId}/${task.asanaTask.id}`)
			// Display a message box to the user
			vscode.window.showInformationMessage('Task URL copied to clipboard');
		}
	});
	context.subscriptions.push(disposable2);

	let disposable3 = vscode.commands.registerCommand('extension.asanaSelectProjects', async () => {
		const projects  = await pickProjects();
		if (projects) {
			await config.setSelectedProjects(projects.map(e => e.asanaProject.gid));
			vscode.window.showInformationMessage('[Asana] Selected projects configuration updated');
		}
	});
	context.subscriptions.push(disposable3);

}

// this method is called when your extension is deactivated
export function deactivate() {}
