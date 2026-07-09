const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMUqn0mNp372-bQKHa5uLhVQT_Jz9ePiriX6KqrdokS1IZZP3IbjqWiBBybvkx9fLFfdZWHaSbz2dQ/pub?output=csv";

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

function show(list){

    results.innerHTML = "";

    count.textContent = `تعداد نتایج: ${list.length}`;

    if(list.length===0){

        results.innerHTML="<p>نتیجه‌ای پیدا نشد.</p>";
        return;

    }

    list.forEach(book=>{

        results.innerHTML += `
        <div class="book">
            <h3>${book.title}</h3>
            <p><b>نویسنده:</b> ${book.author}</p>
            <p><b>مترجم:</b> ${book.translator}</p>
            <p><b>شماره ثبت:</b> ${book.reg}</p>
        </div>`;
    });

}
function startsWithWord(text, q) {
    return normalize(text)
        .split(/\s+/)
        .some(word => word.startsWith(q));
}

search.addEventListener("input", function () {

    const q = normalize(this.value);

    if (q.length < 4) {
        results.innerHTML = "";
        count.textContent = "حداقل ۴ حرف وارد کنید";
        return;
    }

    let filtered = [];

    // 1- عنوان دقیق
    filtered = books.filter(book =>
        normalize(book.title) === q
    );

    // 2- شروع عنوان
    if (filtered.length === 0) {
        filtered = books.filter(book =>
            normalize(book.title).startsWith(q)
        );
    }

    // 3- شروع یکی از کلمات عنوان
    if (filtered.length === 0) {
        filtered = books.filter(book =>
            startsWithWord(book.title, q)
        );
    }

    // 4- نویسنده
    if (filtered.length === 0) {
        filtered = books.filter(book =>
            startsWithWord(book.author, q)
        );
    }

    // 5- مترجم
    if (filtered.length === 0) {
        filtered = books.filter(book =>
            startsWithWord(book.translator, q)
        );
    }

    // 6- شماره ثبت
    if (filtered.length === 0) {
        filtered = books.filter(book =>
            normalize(book.reg).startsWith(q)
        );
    }

    count.textContent = `تعداد نتایج: ${filtered.length}`;

    show(filtered.slice(0, 5));

});
