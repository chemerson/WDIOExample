## Contributing

#### Contributing is simple:

1. Create a new branch from master.
2. npm install
3. Make changes, npm run lint ( The linter will also run as part of the git pre-commit hook. )
4. Open a PR.
5. Please assign to '@nytm/tat' for review.
6. Merge the PR after getting one approval from the TAT team.
7. Delete the branch.


#### Guidelines:

* Master is protected:
  * no pushes directly to master
  * require approvals for merges
* This is basically [GitHub Flow][ghf].
* Follow [Tim Pope's advice][tpa] on commit messages.
* Don't merge a PR unless you're assigned, but feel free to comment.
* Push early and often, so your colleagues can see what you're working on.
* Rebase and force push as often as you like. It's your branch.
* Avoid long running branches.

[ghf]: https://guides.github.com/introduction/flow/index.html
[tpa]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
