import { Octokit } from "https://esm.sh/octokit?dts"

const auth_file = await Deno.readTextFile("./gh_personal_access.txt") 
// console.log(auth_file)
const octokit = new Octokit ({
    auth: auth_file
})

const pagenum = 100

const printnotif = await octokit.request('GET /notifications', { 
    per_page: pagenum,
    page: 1,
    headers: {
	'Accept': 'application/vnd.github+json',
	'X-Github-Api-Version': '2022-11-28'
    }
})
const valStack = []
const data = printnotif['data']
let i = 0
// console.log(printnotif)
console.clear()
console.log("Notifications:\n")
while (i < data.length) {
    const full_name = data[i]['repository']['full_name']
    const reason = data[i]['reason']
    const updated_at = data[i]['updated_at']
    const title = data[i]['subject']['title']
    const url = data[i]['subject']['url']
    const type = data[i]['subject']['type']
    if (type == "PullRequest") {
	const url_split = url.split(`https://api.github.com/repos/${full_name}/pulls/`)
	const new_url = `https://github.com/${full_name}/pull/${url_split[1]}`
	valStack.push(new_url)
    } else if (type == "Issue") {
	const url_split = url.split(`https://api.github.com/repos/${full_name}/issues/`)
	const new_url = `https://github.com/${full_name}/issues/${url_split[1]}`
	valStack.push(new_url)
    }
    // console.log(url_split) 
        
    console.log("--------------------------------------------------------")
    console.log(`From: ${full_name} (${reason}) \n${type}: ${title}\nUpdated At: ${updated_at}\nURL: ${valStack.pop()}\n`)
    i++
}
// const test_url = data[0]['subject']['url']i
// console.log(`\n\n${test_url}{/html_url}`)
Deno.exit(0)
