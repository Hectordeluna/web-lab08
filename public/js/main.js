
window.onload = function() {
    this.getall();
};

document.getElementById("searchAuthor").onclick = function() {
    document.getElementById("list").innerHTML = "";

    let author = document.getElementById("item").value;
    let url = "blog-post/?author=" +  author;

    fetch(url, {
        method: 'GET',
        dataType: 'jsonp',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
        },
    }).then(data => {
        if (!data.ok) {
            document.getElementById("errorId").innerHTML = "";
            var textnode = document.createTextNode(data.status + " " + data.statusText);         
            document.getElementById("errorId").appendChild(textnode);   
        } else {
            return data.text();
        }
    }).then(response => {
        response = JSON.parse(response);
        console.log(response);
        response.forEach(element => {
            var node = document.createElement("li"); 
            var id = document.createElement("p");                 
            var textnode = document.createTextNode(element.id);         
            id.appendChild(textnode);                 
            var content = document.createElement("p");                 
            var textnode = document.createTextNode(element.author + " " + element.title + " " + element.content);         
            content.appendChild(textnode);                             
            var date = document.createElement("p");                 
            var textnode = document.createTextNode(element.publishDate);
            date.appendChild(textnode); 
            node.appendChild(id);                                 
            node.appendChild(content);                                    
            node.appendChild(date);                                                                     
            document.getElementById("list").appendChild(node);    
        });
    });  
}

// Get the button, and when the user clicks on it, execute myFunction
document.getElementById("newPost").onclick = function() {
    event.preventDefault();
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let author = document.getElementById("author").value;

    let data = {
        "title": title,
        "author": author,
        "content": content,
    };

    let response = fetch('blog-posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data),
    }).then(data => {
        if (!data.ok) {
            document.getElementById("errorId").innerHTML = "";
            var textnode = document.createTextNode(data.status + " " + data.statusText);         
            document.getElementById("errorId").appendChild(textnode);   
        } else {
            document.getElementById("errorId").innerHTML = "";
            getall();
            return data.text();
        }
    });     
};

document.getElementById("update").onclick = function() {
    event.preventDefault();
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let author = document.getElementById("author").value;
    let id = document.getElementById("id").value;

    let data = {
        "id" : id,
        "title": title,
        "author": author,
        "content": content,
    };

    let response = fetch('blog-posts/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data),
    }).then(data => {
        if (!data.ok) {
            document.getElementById("errorId").innerHTML = "";
            var textnode = document.createTextNode(data.status + " " + data.statusText);         
            document.getElementById("errorId").appendChild(textnode);   
        } else {
            document.getElementById("errorId").innerHTML = "";
            getall();
            return data.text();
        }
    });     
};

document.getElementById("deletePost").onclick = function() {
    event.preventDefault();
    let id = document.getElementById("id").value;


    let response = fetch('blog-posts/' + id, {
        method: 'DELETE',
        headers: {'content-type': 'application/json'},
    }).then(data => {
        if (!data.ok) {
            document.getElementById("errorId").innerHTML = "";
            var textnode = document.createTextNode(data.status + " " + data.statusText);         
            document.getElementById("errorId").appendChild(textnode);   
        } else {
            document.getElementById("errorId").innerHTML = "";
            getall();
            return data.text();
        }
    });     
};

function getall() {
    document.getElementById("list").innerHTML = "";
    fetch('blog-posts', {
        method: 'GET',
        dataType: 'jsonp',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
        },
    }).then(data => {
        if (!data.ok) {
            document.getElementById("errorId").innerHTML = "";
            var textnode = document.createTextNode(data.status + " " + data.statusText);         
            document.getElementById("errorId").appendChild(textnode);   
        } else {
            return data.text();
        }
    }).then(response => {
        response = JSON.parse(response);
        console.log(response);
        response.forEach(element => {
            var node = document.createElement("li"); 
            var id = document.createElement("p");                 
            var textnode = document.createTextNode(element.id);         
            id.appendChild(textnode);                 
            var content = document.createElement("p");                 
            var textnode = document.createTextNode(element.author + " " + element.title + " " + element.content);         
            content.appendChild(textnode);                             
            var date = document.createElement("p");                 
            var textnode = document.createTextNode(element.publishDate);
            date.appendChild(textnode); 
            node.appendChild(id);                                 
            node.appendChild(content);                                    
            node.appendChild(date);                                                                     
            document.getElementById("list").appendChild(node);    
        });
    });  
}