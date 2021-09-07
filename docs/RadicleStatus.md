# Radicle Status
As another means of decentralizing the skyblog, we are working to make it's source code accessible on [Radicle](https://radicle.xyz/).

## Goals
* **Goal 1:** Figure out how to upload the source code manually
* **Goal 2:** If possible, integrate it with a github action to mirror the repository
## Status of Goal #1

Uploading the source code manually has been challenging. There is no CLI version of the software currently. There is a Mac and Linux version (not quite sure whether linux for desktop or server), but no Windows version of the software.

To interact with the program, you currently must use the GUI. It's not something web based which makes it difficult to access. I've not seen any docker images available. It's not clear what underlying dependencies are needed to support the GUI to design a dockerfile.

Previously, [dghelm](https://github.com/dghelm) was working on integrating this project with skynet. I got a status update from him. He had gotten a workaround using the [WSL](https://docs.microsoft.com/en-us/windows/wsl/about) and by joining the Windows Insider Program. Unfortunately, the process of getting it to work and the side effects of joining the Windows Insider Program are not going to be a viable option for everyone

We made some other discoveries from interacting with the UI using WSL. 
* It seems like it may be important to have an instance of the program running in order to host the code. 
* It seems like you need to run an instance of the program in order to view the code. 

So, with these thoughts in mind, our next steps are to try running the GUI on a spare linux server. 

**TLDR** No windows support, no CLI, currently making an effort with a linux server
## Status of Goal #2
We are most likely going to be stuck on this for now since there is no CLI version. If we can get through Goal #1 with a server with the repository on it, we may be able to use Git to push to the repo we're hosting on the linux server