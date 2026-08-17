// =========================
// Login Form
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                // JWT token save
                localStorage.setItem("token", data.token);

                // User information save
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                alert("Login successful!");

                window.location.href = "dashboard.html";

            } else {

                alert(data.message || "Login failed");

            }

        } catch (error) {

            console.error(error);

            alert("Server se connection nahi ho pa raha.");

        }

    });
}

// =========================
// Register Form
// =========================


const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        // Check password
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Registration successful!");

                // Login page par bhejo
                window.location.href = "login.html";

            } else {

                alert(data.message || "Registration failed");

            }

        } catch (error) {

            console.error(error);

            alert("Server can not be contacted.");

        }

    });
}


// =========================
// Create Blog Form
// =========================

const blogForm = document.getElementById("blogForm");
console.log("Blog form found:", blogForm);

if (blogForm) {

    blogForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const token = localStorage.getItem("token");
         console.log("Token:",token);

        if (!token) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        const title = document.getElementById("title").value.trim();
        const category = document.getElementById("category").value;
        const image = document.getElementById("image").value.trim();
        const content = document.getElementById("content").value.trim();
     // const status = document.getElementById("status").value;

        const tags = document
            .getElementById("tags")
            .value
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "");

        try {

            const response = await fetch(
                "http://localhost:5000/api/blogs",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title,
                        category,
                        image,
                        content,
                        tags,
                       // status
                    })
                }
            );

            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok) {

                alert("Blog created successfully! 🎉");

                blogForm.reset();

                window.location.href = "dashboard.html";

            } else {

                alert(data.message || "Blog creation failed");

            }

        } catch (error) {

            console.error(error);

            alert("Server can not be contacted.");

        }
    });
}

// =========================
// Like Button
// =========================

const likeBtn = document.getElementById("likeBtn");

if (likeBtn) {

    let liked = false;

    likeBtn.addEventListener("click", function () {

        liked = !liked;

        if (liked) {
            likeBtn.textContent = "❤️ Liked";
        } else {
            likeBtn.textContent = "❤️ Like";
        }

    });
}


// =========================
// Share Button
// =========================

const shareBtn = document.getElementById("shareBtn");

if (shareBtn) {

    shareBtn.addEventListener("click", function () {

        navigator.clipboard.writeText(window.location.href);

        alert("Blog link copied!");
    });
}


// =========================
// Comment Form
// =========================

const commentForm = document.getElementById("commentForm");

if (commentForm) {

    commentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const commentInput =
            document.getElementById("commentInput");

        const commentText =
            commentInput.value.trim();

        if (!commentText) {
            return;
        }

        const commentsList =
            document.getElementById("commentsList");

        const comment = document.createElement("div");

        comment.classList.add("comment");

        comment.innerHTML = `
            <div class="comment-header">
                <strong>You</strong>
                <span>Just now</span>
            </div>

            <p>${commentText}</p>
        `;

        commentsList.prepend(comment);

        commentInput.value = "";
    });
}

// =========================
// Dashboard Authentication
// =========================

const dashboardPage = document.querySelector(".dashboard-page");

if (dashboardPage) {

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Login nahi hai
    if (!token) {

        window.location.href = "login.html";

    } else {

        const user = JSON.parse(userData);

        const welcomeUser =
            document.getElementById("welcomeUser");

        if (welcomeUser && user) {
            welcomeUser.textContent =
                `Welcome back, ${user.name}!`;
        }
    }
}


// =========================
// Logout
// =========================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";

    });
}

// =========================
// Load My Blogs in Dashboard
// =========================

const myBlogsList = document.getElementById("myBlogsList");

if (myBlogsList) {

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
        window.location.href = "login.html";
    } else {

        const user = JSON.parse(userData);

        fetch("http://localhost:5000/api/blogs")
            .then(response => response.json())
            .then(blogs => {

                // Sirf current user ke blogs
                const myBlogs = blogs.filter(blog => {

                    const authorId =
                        blog.author?._id || blog.author;

                    return authorId === user.id;
                });

                // Statistics
                const totalBlogs =
                    document.getElementById("totalBlogs");

                const publishedBlogs =
                    document.getElementById("publishedBlogs");

                const draftBlogs =
                    document.getElementById("draftBlogs");

                totalBlogs.textContent = myBlogs.length;

                publishedBlogs.textContent =
                    myBlogs.filter(
                        blog => blog.status === "published"
                    ).length;

                draftBlogs.textContent =
                    myBlogs.filter(
                        blog => blog.status === "draft"
                    ).length;


                // No blogs
                if (myBlogs.length === 0) {

                    myBlogsList.innerHTML = `
                        <div class="empty-state">
                            <h3>No blogs yet</h3>
                            <p>You haven't created any blog posts yet.</p>

                            <a
                                href="create-blog.html"
                                class="primary-btn">
                                Write Your First Blog
                            </a>
                        </div>
                    `;

                    return;
                }


                // Display blogs
                myBlogsList.innerHTML = myBlogs.map(blog => {

                    return `
                        <div class="dashboard-blog-card">

                            <div class="dashboard-blog-info">

                                <span class="blog-category">
                                    ${blog.category}
                                </span>

                                <h3>
                                    ${blog.title}
                                </h3>

                                <p>
                                    ${blog.content.substring(0, 150)}...
                                </p>

                                <small>
                                    ${blog.status}
                                </small>

                            </div>

                            <div class="dashboard-blog-actions">

                                <button
                                    onclick="editBlog('${blog._id}')">
                                    Edit
                                </button>

                                <button
                                    onclick="deleteBlog('${blog._id}')">
                                    Delete
                                </button>

                            </div>

                        </div>
                    `;

                }).join("");

            })
            .catch(error => {

                console.error(
                    "Failed to load blogs:",
                    error
                );

                myBlogsList.innerHTML = `
                    <p>Unable to load blogs.</p>
                `;
            });
    }
}

// =========================
// Edit Blog
// =========================

const editBlogForm = document.getElementById("editBlogForm");

if (editBlogForm) {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }

    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("id");

    if (!blogId) {
        alert("Blog ID missing");
        window.location.href = "dashboard.html";
    }


    // Load existing blog
    fetch(`http://localhost:5000/api/blogs/${blogId}`)
        .then(response => response.json())
        .then(blog => {

            document.getElementById("editTitle").value =
                blog.title || "";

            document.getElementById("editCategory").value =
                blog.category || "";

            document.getElementById("editImage").value =
                blog.image || "";

            document.getElementById("editContent").value =
                blog.content || "";

            document.getElementById("editTags").value =
                blog.tags ? blog.tags.join(", ") : "";

            document.getElementById("editStatus").value =
                blog.status || "published";

        })
        .catch(error => {

            console.error(error);

            alert("Blog load nahi ho pa raha.");
        });


    // Update blog
    editBlogForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const title =
            document.getElementById("editTitle").value.trim();

        const category =
            document.getElementById("editCategory").value;

        const image =
            document.getElementById("editImage").value.trim();

        const content =
            document.getElementById("editContent").value.trim();

        const status =
            document.getElementById("editStatus").value;

        const tags =
            document.getElementById("editTags").value
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag !== "");


        try {

            const response = await fetch(
                `http://localhost:5000/api/blogs/${blogId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },

                    body: JSON.stringify({
                        title,
                        category,
                        image,
                        content,
                        tags,
                        status
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Blog updated successfully!");

                window.location.href = "dashboard.html";

            } else {

                alert(data.message || "Update failed");
            }

        } catch (error) {

            console.error(error);

            alert("Server se connection nahi ho pa raha.");
        }
    });
}

function editBlog(blogId) {
    window.location.href = `edit-blog.html?id=${blogId}`;
}


// =========================
// Delete Blog
// =========================

async function deleteBlog(blogId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) {
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/blogs/${blogId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Blog deleted successfully!");

            // Dashboard reload
            window.location.reload();

        } else {

            alert(data.message || "Blog delete failed");

        }

    } catch (error) {

        console.error("Delete error:", error);

        alert("Server se connection nahi ho pa raha.");
    }
}

// =========================
// Blog Details + Comments
// =========================

const blogDetails = document.getElementById("blogDetails");


if (blogDetails) {

    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("id");

    if (!blogId) {

        blogDetails.innerHTML = `
            <h2>Blog not found</h2>
        `;

    } else {

        // Load Blog
        fetch(`http://localhost:5000/api/blogs/${blogId}`)
            .then(response => response.json())
            .then(blog => {

                blogDetails.innerHTML = `
                    <div class="blog-detail-card">

                        <span class="blog-category">
                            ${blog.category}
                        </span>

                        <h1>${blog.title}</h1>

                        ${
                            blog.image
                            ? `<img
                                src="${blog.image}"
                                alt="${blog.title}"
                                class="blog-detail-image"
                              >`
                            : ""
                        }

                        <p class="blog-author">
                            By ${blog.author?.name || "Unknown Author"}
                        </p>

                        <div class="blog-content">
                            ${blog.content}
                        </div>

                    </div>
                `;

            })
            .catch(error => {

                console.error(error);

                blogDetails.innerHTML = `
                    <h2>Unable to load blog</h2>
                `;
            });


        // Load Comments
        loadComments(blogId);


        // Add Comment
        if (commentForm) {

            commentForm.addEventListener("submit", async function(event) {

                event.preventDefault();

                const token = localStorage.getItem("token");

                if (!token) {

                    alert("Please login to comment.");

                    window.location.href = "login.html";

                    return;
                }

                const text =
                    document.getElementById("commentText")
                    .value
                    .trim();

                if (!text) {
                    alert("Please write a comment.");
                    return;
                }


                try {

                    const response = await fetch(
                        `http://localhost:5000/api/comments/${blogId}`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + token
                            },

                            body: JSON.stringify({
                                text: text
                            })
                        }
                    );

                    const data = await response.json();

                    if (response.ok) {

                        alert("Comment added successfully!");

                        document.getElementById(
                            "commentText"
                        ).value = "";

                        loadComments(blogId);

                    } else {

                        alert(
                            data.message ||
                            "Comment failed"
                        );

                    }

                } catch (error) {

                    console.error(error);

                    alert(
                        "Server se connection nahi ho pa raha."
                    );
                }

            });
        }
    }
}


// Load Comments Function

async function loadComments(blogId) {

    if (!commentsList) return;

    try {

        const response = await fetch(
            `http://localhost:5000/api/comments/${blogId}`
        );

        const comments = await response.json();


        if (!comments.length) {

            commentsList.innerHTML = `
                <div class="no-comments">
                    <p>No comments yet.</p>
                    <p>Be the first to comment!</p>
                </div>
            `;

            return;
        }


        commentsList.innerHTML = comments.map(comment => {

            return `
                <div class="comment-card">

                    <div class="comment-header">

                        <strong>
                            ${comment.user?.name || "User"}
                        </strong>

                        <small>
                            ${new Date(
                                comment.createdAt
                            ).toLocaleDateString()}
                        </small>

                    </div>

                    <p>
                        ${comment.text}
                    </p>

                </div>
            `;

        }).join("");


    } catch (error) {

        console.error(error);

        commentsList.innerHTML = `
            <p>Unable to load comments.</p>
        `;
    }
}

// =========================
// Blog Details
// =========================




if (blogDetails) {

    // URL se Blog ID lena
    const params = new URLSearchParams(window.location.search);

    const blogId = params.get("id");


    if (!blogId) {

        blogDetails.innerHTML = `
            <h2>Blog not found</h2>
        `;

    } else {

        // =========================
        // Load Blog
        // =========================

        fetch(`http://localhost:5000/api/blogs/${blogId}`)

            .then(response => response.json())

            .then(blog => {

                blogDetails.innerHTML = `

                    <div class="blog-detail-card">

                        <span class="blog-category">
                            ${blog.category}
                        </span>


                        <h1>
                            ${blog.title}
                        </h1>


                        ${
                            blog.image
                            ?
                            `
                            <img
                                src="${blog.image}"
                                alt="${blog.title}"
                                class="blog-detail-image"
                            >
                            `
                            :
                            ""
                        }


                        <p class="blog-author">

                            By
                            ${blog.author?.name || "Unknown Author"}

                        </p>


                        <div class="blog-content">

                            ${blog.content}

                        </div>

                    </div>

                `;

            })

            .catch(error => {

                console.error(error);

                blogDetails.innerHTML = `
                    <h2>Unable to load blog</h2>
                `;

            });


        // Comments load
        loadComments(blogId);


        // =========================
        // Add Comment
        // =========================

        if (commentForm) {

            commentForm.addEventListener(
                "submit",
                async function(event) {

                    event.preventDefault();


                    const token =
                        localStorage.getItem("token");


                    // Login check

                    if (!token) {

                        alert(
                            "Please login to comment."
                        );

                        window.location.href =
                            "login.html";

                        return;

                    }


                    const text =
                        document
                            .getElementById("commentText")
                            .value
                            .trim();


                    if (!text) {

                        alert(
                            "Please write a comment."
                        );

                        return;

                    }


                    try {

                        const response =
                            await fetch(
                                `http://localhost:5000/api/comments/${blogId}`,
                                {

                                    method: "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json",

                                        "Authorization":
                                            "Bearer " + token

                                    },

                                    body: JSON.stringify({
                                        text: text
                                    })

                                }
                            );


                        const data =
                            await response.json();


                        if (response.ok) {

                            alert(
                                "Comment added successfully!"
                            );


                            document
                                .getElementById("commentText")
                                .value = "";


                            loadComments(blogId);

                        } else {

                            alert(
                                data.message ||
                                "Comment failed"
                            );

                        }

                    } catch (error) {

                        console.error(error);

                        alert(
                            "Server se connection nahi ho pa raha."
                        );

                    }

                }
            );

        }

    }

}


// =========================
// Load Comments
// =========================

async function loadComments(blogId) {

    if (!commentsList) return;


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/comments/${blogId}`
            );


        const comments =
            await response.json();


        if (!comments.length) {

            commentsList.innerHTML = `

                <div class="no-comments">

                    <p>
                        No comments yet.
                    </p>

                    <p>
                        Be the first to comment!
                    </p>

                </div>

            `;

            return;

        }


        commentsList.innerHTML =
            comments.map(comment => {

                return `

                    <div class="comment-card">

                        <div class="comment-header">

                            <strong>
                                ${comment.user?.name || "User"}
                            </strong>


                            <small>
                                ${new Date(
                                    comment.createdAt
                                ).toLocaleDateString()}
                            </small>

                        </div>


                        <p>
                            ${comment.text}
                        </p>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(error);

        commentsList.innerHTML = `
            <p>
                Unable to load comments.
            </p>
        `;

    }

}

// =========================
// Blog Details
// =========================



if (blogDetails) {

    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("id");
    console.log("Blog ID:", blogId);

    if (!blogId) {

        blogDetails.innerHTML = `
            <h2>Blog not found</h2>
        `;

    } else {

        // Load Blog
        fetch(`http://localhost:5000/api/blogs/${blogId}`)
            .then(response => response.json())
            .then(blog => {

                blogDetails.innerHTML = `
                    <div class="blog-detail-card">

                        <span class="blog-category">
                            ${blog.category}
                        </span>

                        <h1>${blog.title}</h1>

                        ${
                            blog.image
                            ? `
                                <img
                                    src="${blog.image}"
                                    alt="${blog.title}"
                                    class="blog-detail-image"
                                >
                            `
                            : ""
                        }

                        <p class="blog-author">
                            By ${blog.author?.name || "Unknown Author"}
                        </p>

                        <div class="blog-content">
                            ${blog.content}
                        </div>

                    </div>
                `;

            })
            .catch(error => {

                console.error(error);

                blogDetails.innerHTML = `
                    <h2>Unable to load blog</h2>
                `;

            });

        // Load comments
        loadComments(blogId);


        // Add comment
        if (commentForm) {

            commentForm.addEventListener("submit", async function(event) {

                event.preventDefault();

                const token = localStorage.getItem("token");

                if (!token) {

                    alert("Please login to comment.");

                    window.location.href = "login.html";

                    return;
                }

                const text =
                    document.getElementById("commentText")
                    .value
                    .trim();

                if (!text) {
                    alert("Please write a comment.");
                    return;
                }

                try {

                    const response = await fetch(
                        `http://localhost:5000/api/comments/${blogId}`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + token
                            },

                            body: JSON.stringify({
                                text: text
                            })
                        }
                    );

                    const data = await response.json();

                    if (response.ok) {

                        alert("Comment added successfully!");

                        document.getElementById("commentText").value = "";

                        loadComments(blogId);

                    } else {

                        alert(data.message || "Comment failed");

                    }

                } catch (error) {

                    console.error(error);

                    alert("Server se connection nahi ho pa raha.");
                }
            });
        }
    }
}


// =========================
// Load Comments
// =========================

async function loadComments(blogId) {

    if (!commentsList) return;

    try {

        const response = await fetch(
            `http://localhost:5000/api/comments/${blogId}`
        );

        const comments = await response.json();

        if (!comments.length) {

            commentsList.innerHTML = `
                <div class="no-comments">
                    <p>No comments yet.</p>
                    <p>Be the first to comment!</p>
                </div>
            `;

            return;
        }

        commentsList.innerHTML = comments.map(comment => {

            return `
                <div class="comment-card">

                    <div class="comment-header">

                        <strong>
                            ${comment.user?.name || "User"}
                        </strong>

                        <small>
                            ${new Date(comment.createdAt)
                                .toLocaleDateString()}
                        </small>

                    </div>

                    <p>
                        ${comment.text}
                    </p>

                </div>
            `;

        }).join("");

    } catch (error) {

        console.error(error);

        commentsList.innerHTML = `
            <p>Unable to load comments.</p>
        `;
    }
}

// =========================
// Public Blogs
// =========================

const blogsList = document.getElementById("blogsList");

if (blogsList) {

    fetch("http://localhost:5000/api/blogs")
        .then(response => {

            console.log("Blogs API status:", response.status);

            return response.json();
        })
        .then(blogs => {

            console.log("Blogs received:", blogs);

            if (!Array.isArray(blogs) || blogs.length === 0) {

                blogsList.innerHTML = `
                    <p>No blogs found.</p>
                `;

                return;
            }

            blogsList.innerHTML = blogs.map(blog => {

                return `
                    <article class="public-blog-card">

                        <h2>${blog.title}</h2>

                        <p>
                            ${blog.content.substring(0, 180)}...
                        </p>

                        <p>
                            Category: ${blog.category}
                        </p>

                        <a
                            href="blog-details.html?id=${blog._id}"
                            class="read-more-btn">
                            Read More →
                        </a>

                    </article>
                `;

            }).join("");

        })
        .catch(error => {

            console.error("Blogs loading error:", error);

            blogsList.innerHTML = `
                <p>Unable to load blogs.</p>
            `;
        });
}