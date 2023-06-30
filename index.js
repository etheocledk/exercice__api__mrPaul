async function blogLoader() {
    let link = window.location.pathname
    console.log(link);
    if (link === '/') {
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
                    randomNews = `<div class="banner_content">
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
                    console.log(button);
                    
                    if (button) {
                        button.forEach(item => {
                            item.addEventListener('click', (e) => {
                                e.preventDefault()
                                let postsFilter;
                                if (showPosts) {
                                    let showArticles = ``;
                                    if(item.value==='All'){
                                        postsFilter=dataPosts.posts
                                    }else{
                                        postsFilter=dataPosts.posts.filter((post) => post.category_name == item.value)
                                    }
                                    postsFilter.forEach(item => {
                                        showArticles += `
                                    <div class="post_articles_content_item">
                                        <div class="post_articles_content_item_img">
                                            <img src="https://test1.ecole229.bj${item.image}" alt="">
                                        </div>
                                        <div class="post_articles_content_item_texte">
                                            <p id="title"><strong>Titre : </strong>  ${item.title}</p>
                                            <p id="date"> <strong>Date : </strong> ${item.published_at}</p>
                                            <a class='more' href="http://127.0.0.1:5500/detail.html?id=${item.id}">Voir plus...</a>
                                        </div>
                                    </div>`
                                    })
                                    showPosts.innerHTML = 
                                     showArticles
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

    if (link === '/detail.html') {
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