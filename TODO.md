# To Do List
- Add ability to view images/video fullscreen
- Add number of files within inbox (from mr_bones api call) -> use injector service to reduce number as it will be on the toolbar
- Add ability to sort by direction and type as well as others (Currently sortDir and sortType are hardcoded)
    ```
        searchFiles(): void {
            //temp
            let sortDir = true;
            let sortType = 2;
            ...
        }
    ``` 
- create seperate components (search -> virtual scroller...etc) to be reused in other components like both search and archive/delete filter needing search functionality
- saving current search and maintaining the search parameters on reload
- Duplicate filtering