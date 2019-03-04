var Base64 = require('js-base64').Base64;
const Settings = require('sketch/settings')
import { AES_Decrypt_String, AES_Encrypt_String } from "./jsaes"

export function get_file(owner, repo, path, callback, error_callback){
    // creating token https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
    // https://api.github.com/repos/${owner}/${repo}/git/blobs/${path}
    console.log(`fetching https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    var encrypt = Settings.settingForKey('git-token');
    var token = AES_Decrypt_String(encrypt);
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,{
        method: "GET",
        headers: {
          'Authorization': "Basic " + Base64.encode("token "+ token), //+ AES_Decrypt_String(Settings.settingForKey('git-token'))),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })
        .then(response => {console.log(response); return response.json();})
        .then(text => {callback(JSON.parse(Base64.decode(text.content)))})
        .catch(e => error_callback(`There was a problem with ${owner}/${repo}/${path}.\nDo you have access to it? Are your credentials correct?`))
}
