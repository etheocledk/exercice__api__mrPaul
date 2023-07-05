async function blogLoader() {
    let link = window.location.pathname

    console.log(link);
    if (link === '/') {
        //     let shoButton = document.querySelector('body')
        // shoButton.innerHTML = `<img src="loader.gif" alt="Loader" width= 20px>`
        let showButton = document.querySelector('.posts_categories_content_type')
        showButton.innerHTML = `<img src="loader.gif" alt="Loader" width= 20px>`
        let response = await fetch(`https://test1.ecole229.bj/api/categories`)
        let dataCategories = await response.json()
        console.log(dataCategories)
        let showBtn = ``
        
        if (dataCategories.status === true) {
            if (dataCategories.categories.length > 0) {
                dataCategories.categories.forEach(item => {
                    showBtn += `<button value="${item.name}">${item.name}</button>`
                });
                showButton.innerHTML = `
                    <button value="All">All</button>
                    ${showBtn}
                `
            } else {
                showButton.innerHTML = 'Aucune donnée disponible.'
            }


            let showPosts = document.querySelector('.post_articles_content')
            let responses = await fetch(`https://test1.ecole229.bj/api/posts`)
            let dataPosts = await responses.json()
            console.log(dataPosts)
            let randomNews = ``;
            let randomNewsTag = document.querySelector('.banner .container');

            if (dataPosts.status === true) {
                if (dataPosts.posts.length > 0) {

                    let randomIndex = Math.floor((Math.random() * dataPosts.posts.length))
                    randomNews = `
                    <div class="banner_content">
                        <div class="banner_content_left">
                            <img src="https://test1.ecole229.bj${dataPosts.posts[randomIndex].image}" alt="">
                        </div>
                        <div class="banner_content_right">
                            <div class="banner_content_right_author">
                                <h4>${dataPosts.posts[randomIndex].user_name}</h4>
                                <h4>${dataPosts.posts[randomIndex].published_at}</h4>
                            </div>
                            <p id="titre">${dataPosts.posts[randomIndex].title}</p>
                        </div>
                    </div>`

                    if (randomNewsTag) {
                        randomNewsTag.insertAdjacentHTML('beforeend', randomNews)
                    } else {
                        randomNewsTag.innerHTML = 'Aucune donnée disponible'
                    }



                    let button = document.querySelectorAll('.posts_categories_content_type button')

                    let showArticles = ``;
                    dataPosts.posts.forEach(item => {
                        showArticles += `
                             <div class="post_articles_content_item">
                                <div class="post_articles_content_item_img">
                                    <img src="https://test1.ecole229.bj${item.image}" alt="">
                                </div>
                                <div class="post_articles_content_item_texte">
                                    <p id="date"><span class="mdi mdi-calendar-month"></span> ${item.published_at}</p>
                                    <h4 id="title">${item.title}</h4>
                                    <a class='more' href="/detail.html?id=${item.id}">Voir plus...</a>
                                </div>
                            </div>`})

                    showPosts.innerHTML = showArticles

                    console.log(button);

                    if (button) {
                        button.forEach(item => {
                            item.addEventListener('click', (e) => {
                                e.preventDefault()
                                showArticles = ``; 
                                let postsFilter;
                                if (showPosts) {
                                   
                                    if (item.value === 'All') {
                                        postsFilter = dataPosts.posts
                                        console.log(postsFilter.length);
                                    } else {
                                        postsFilter = dataPosts.posts.filter((post) => post.category_name == item.value)
                                        console.log(postsFilter.length);
                                    }

                                    let pageButton__container = document.querySelector('.pageButton__container')
                                    if (postsFilter.length > 10) {
                                        let pageButton = ``
                                        let pageNumber = Math.ceil(postsFilter.length / 9)
                                        for (let i = 1; i <= pageNumber; i++) {
                                            pageButton += `<a href='#'>${i}</a>`
                                        }
                                        pageButton = `
                                            <button id="preview"> &blacktriangleleft;</button>
                                            ${pageButton}
                                            <button class="next"> &blacktriangleright;</button>
                                            `
                                        pageButton__container.innerHTML = pageButton
                                    } else {
                                        pageButton__container.innerHTML = ``
                                    }

                                    let getButtonPagination = document.querySelectorAll('.pageButton__container *')

                                    if (getButtonPagination) {
                                        getButtonPagination.forEach(item => {

                                            item.addEventListener('click', (e) => {
                                                e.preventDefault()
                                                let itemTarget = e.currentTarget /*renvoie l'element courant sur lequel on a cliqué*/
                                                /* let eTarget=e.target //renvoi le dernier enfant de l'element sur lequel on a cliqué
                                                console.log(itemTarget); */
                                                if (showPosts.innerHTML != '') {
                                                    showArticles = ``

                                                    if (e.target.tagName === 'A') {
                                                        getButtonPagination.forEach(item => {
                                                            if (item.classList.contains('active')) {
                                                                item.classList.remove('active')
                                                            }
                                                        })
                                                        e.target.classList.add('active')
                                                        
                                                        let numPage = Number(e.target.innerText)

                                                        
                                                        let end = (numPage * 9)
                                                        let begin = end - 9
                                                        let viewArticle = postsFilter.slice(begin, end)
                                                        console.log(viewArticle);
                                                        viewArticle.forEach(item => {
                                                            showArticles += `
                                                                 <div class="post_articles_content_item">
                                                                    <div class="post_articles_content_item_img">
                                                                        <img src="https://test1.ecole229.bj${item.image}" alt="">
                                                                    </div>
                                                                    <div class="post_articles_content_item_texte">
                                                                        <p id="date"><span class="mdi mdi-calendar-month"></span> ${item.published_at}</p>
                                                                        <h4 id="title">${item.title}</h4>
                                                                        <a class='more' href="/detail.html?id=${item.id}">Voir plus...</a>
                                                                    </div>
                                                                </div>`})

                                                        showPosts.innerHTML = showArticles

                                                    } else if (e.target.tagName === 'BUTTON') {
                                                        let preview = document.querySelector('#preview')
                                                        preview.addEventListener('click', () => {

                                                            console.log((e.target));
                                                            getButtonPagination.forEach(item => {
                                                                if (item.tagName === 'A' && item.classList.contains('active')) {
                                                                    item.classList.remove('active')
                                                                    let numberA = Number(item.innerText)
                                                                    let numPage;


                                                                    if(numberA>1) {
                                                                        numPage = numberA - 1}

                                                                   
                                                                    let end = (numPage * 9)
                                                                    let begin = end - 9
                                                                    let viewArticle = postsFilter.slice(begin, end)

                                                                    viewArticle.forEach(item => {
                                                                        showArticles += `
                                                                            <div class="post_articles_content_item">
                                                                                <div class="post_articles_content_item_img">
                                                                                    <img src="https://test1.ecole229.bj${item.image}" alt="">
                                                                                </div>
                                                                                <div class="post_articles_content_item_texte">
                                                                                    <p id="date"><span class="mdi mdi-calendar-month"></span> ${item.published_at}</p>
                                                                                    <h4 id="title">${item.title}</h4>
                                                                                    <a class='more' href="/detail.html?id=${item.id}">Voir plus...</a>
                                                                                </div>
                                                                            </div>`})

                                                                    showPosts.innerHTML = showArticles
                                                                }
                                                            })

                                                        })
                                                    }
                                                }

                                            })
                                        })
                                    }



                                    postsFilter.forEach(item => {
                                                showArticles+= `
                                    <div class="post_articles_content_item">
                                        <div class="post_articles_content_item_img">
                                            <img src="https://test1.ecole229.bj${item.image}" alt="">
                                        </div>
                                        <div class="post_articles_content_item_texte">
                                            <p id="date"><span class="mdi mdi-calendar-month"></span> ${item.published_at}</p>
                                            <h4 id="title">${item.title}</h4>
                                            <a class='more' href="/detail.html?id=${item.id}">Voir plus...</a>
                                        </div>
                                    </div>`
                                    })

                                    showPosts.innerHTML = showArticles 
                                } else {
                                    showPosts.innerHTML = 'Aucune donnée disponible'
                                }

                            })
                        })
                    }
                }
            }

        }
    }

    let numberofItem = 9

    function showList() {

    }


    if (link ==='/detail.html') {
        let newLink = window.location.href
        let url = new URL(newLink)
        let id = url.searchParams.get('id')
        console.log(id);

        let responses = await fetch(`https://test1.ecole229.bj/api/posts`)
        let dataPosts = await responses.json()
        let Posts = dataPosts.posts
        const postsFilter = Posts.filter((post) => post.id == id)
        let detail = document.querySelector('.detail__container')
        if (detail) {
            let itemTag = ``
            postsFilter.forEach(item => {
                itemTag += `
            <div class="body__container">
                <div class="modal__background">
                    <img src=https://test1.ecole229.bj/${item.image}  alt="">
                </div>
                <div class="modal__profil">
                    <img src=https://test1.ecole229.bj/${item.user_avatar} alt="">
                </div>
                <div class="modal__contenu">
                    <p><strong>Nom d'utilisateur: </strong> ${item.user_name}</p>
                    <p><strong>Titre: </strong>${item.title}</p>
                    <p><strong>Date: </strong>${item.published_at}</p>
                    <p><strong>Titre de l'utilisateur: </strong>${item.user_title}</p>
                    <p><strong>Description: </strong>${item.description}</p>
                    <div class="lien">
                        <a href="./index.html" class="retour">${'Retour'}</a>
                    </div>
                </div>
            </div>`
            })
            detail.innerHTML = itemTag
        }

    }
}


blogLoader()