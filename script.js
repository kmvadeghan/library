const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTbC5aUZfh3ADxZKqsa1U0oorUkwa23hQ2lXRQNv-VqAGF33xZ6aHazS6zLttZOrS53xkvZlU7eaW1q/pub?output=csv";

const search = document.getElementById("search");
const results = document.getElementById("results");
const count = document.getElementById("count");

let books = [];

function normalize(text) {
    return (text || "")
        .replace(/ي/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/\u200c/g, "")
        .trim()
        .toLowerCase();
}

Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(res) {

        books = res.data.map(row => ({
            title: row["عنوان"] || "",
            author: row["نویسنده"] || "",
            translator: row["مترجم"] || "",
            reg: row["شماره ثبت"] || ""
        }));

    }
});

function show(list){

    results.innerHTML = "";
    count.textContent = `تعداد نتایج: ${list.length}`;

    list.forEach(book => {

        results.innerHTML += `
            <div class="book">
                <h3>${book.title}</h3>
                <p>نویسنده: ${book.author}</p>
                <p>مترجم: ${book.translator}</p>
                <p>شماره ثبت: ${book.reg}</p>
            </div>
        `;

    });

}

search.addEventListener("input", function(){

    const q = normalize(this.value);

    if(q === ""){
        results.innerHTML = "";
        count.textContent = "";
        return;
    }

    const filtered = books.filter(book =>

        normalize(book.title).includes(q) ||
        normalize(book.author).includes(q) ||
        normalize(book.translator).includes(q) ||
        normalize(book.reg).includes(q)

    );

    show(filtered);

});}

fetch(CSV_URL)
.then(r => r.text())
.then(text => {

    const rows = text.trim().split("\n");

    books = rows.slice(1).map(row => {

        const c = row.split(",");

        return {
            title: c[0] || "",
            author: c[1] || "",
            translator: c[2] || "",
            reg: c[3] || ""
        };

    });

});

search.addEventListener("input", function () {

    const q = normalize(this.value);

    if(q===""){
        results.innerHTML="";
        count.innerHTML="";
        return;
    }

    const filtered = books.filter(book =>

        normalize(book.title).includes(q) ||
        normalize(book.author).includes(q) ||
        normalize(book.translator).includes(q) ||
        normalize(book.reg).includes(q)

    );

    show(filtered);

});
