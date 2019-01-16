var Base64 = require('js-base64').Base64;

export function get_file(owner, repo, path, callback, error_callback){
    // creating token https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
    // https://api.github.com/repos/${owner}/${repo}/git/blobs/${path}
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,{
        method: "GET",
        headers: {
          'Authorization': "Basic " + Base64.encode("YannickWidmer:U_3aMeedei"),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(text => callback(JSON.parse(Base64.decode(text.content))))
        .catch(e => error_callback(`${owner}/${repo}/${path}`))
}