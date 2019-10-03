// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window } from 'vscode';
import config from './config';

export
async function getAsanaApiToken() : Promise<string> {
    let apiToken = config.getApiToken();
    if(!apiToken){
        const result = await window.showInputBox({
            placeHolder: 'Paste your asana API token',
        });
        if(result){
            apiToken = result;
            await config.setApiToken(apiToken);
        }
    }
    if(!apiToken){
        throw  Error('Please configure Asana API Token');
    }
    return apiToken;
}