const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVPSl0RN8A4Nwn97XEoa_olvZAhjX8LkZPxdjQNHvRr31mJ2E-iGkmHI-d4nuGF9_Mk1f25FZIBaHC/pub?output=csv";

const search = document.getElementById("search");
const results = document.getElementById("results");
const count = document.getElementById("count");
const searchInfo = document.getElementById("searchInfo");

let books = [];

function normalize(text) {
    return (text || "")
        .replace(/ي/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/\u200c/g, "")
        .trim()
        .toLowerCase();
}

// ---------- دریافت اطلاعات ----------

fetch(CSV_URL)
    .then(response => {

        if (!response.ok) {
            throw new Error("خطا در دریافت اطلاعات");
        }

        return response.text();

    })

    .then(text => {

        Papa.parse(text, {

            header: true,

            skipEmptyLines: true,

            complete: function (result) {

                books = result.data.map(row => ({

                    title: row["title"] || row["عنوان"] || "",

                    author: row["author"] || row["نویسنده"] || "",

                    translator: row["translator"] || row["مترجم"] || "",

                    reg: row["reg"] || row["شماره ثبت"] || ""

                }));

                count.innerHTML =
                    `📚 تعداد کل کتاب‌های کتابخانه: <b>${books.length}</b>`;

            }

        });

    })

    .catch(() => {

        count.innerHTML = "❌ خطا در دریافت اطلاعات کتابخانه.";

        searchInfo.style.display = "block";

        searchInfo.innerHTML =
            "اتصال اینترنت یا لینک Google Sheet را بررسی کنید.";

    });



// ---------- نمایش نتایج ----------

function show(list, total) {

    results.innerHTML = "";

    count.innerHTML =
        `📖 <b>${total}</b> کتاب یافت شد.`;

    if (total === 0) {

        searchInfo.style.display = "none";

        const div = document.createElement("div");

        div.className = "book";

        div.textContent =
            "❌ کتابی با این مشخصات پیدا نشد.";

        results.appendChild(div);

        return;

    }

    const fragment = document.createDocumentFragment();

    list.forEach(book => {

        const card = document.createElement("div");
        card.className = "book";

        const h3 = document.createElement("h3");
        h3.textContent = book.title;

        const p1 = document.createElement("p");
        p1.innerHTML = "<b>نویسنده:</b> ";

        const span1 = document.createElement("span");
        span1.textContent = book.author;

        p1.appendChild(span1);

        const p2 = document.createElement("p");
        p2.innerHTML = "<b>مترجم:</b> ";

        const span2 = document.createElement("span");
        span2.textContent = book.translator;

        p2.appendChild(span2);

        const p3 = document.createElement("p");
        p3.innerHTML = "<b>شماره ثبت:</b> ";

        const span3 = document.createElement("span");
        span3.textContent = book.reg;

        p3.appendChild(span3);

        card.appendChild(h3);
        card.appendChild(p1);
        card.appendChild(p2);
        card.appendChild(p3);

        fragment.appendChild(card);

    });

    results.appendChild(fragment);

    if (total > 20) {

        searchInfo.style.display = "block";

        searchInfo.innerHTML =
            `📄 فقط <b>20</b> نتیجه از مجموع <b>${total}</b> نتیجه نمایش داده شده است.<br>
             برای رسیدن به کتاب موردنظر، عبارت دقیق‌تر یا کامل‌تری جستجو کنید.`;

    } else {

        searchInfo.style.display = "none";

    }

}



// ---------- جستجو ----------

search.addEventListener("input", function () {

    const q = normalize(this.value);

    if (q.length < 4) {

        results.innerHTML = "";

        count.innerHTML =
            `📚 تعداد کل کتاب‌های کتابخانه: <b>${books.length}</b>`;

        searchInfo.style.display = "block";

        searchInfo.innerHTML =
            "برای جستجو حداقل ۴ حرف از عنوان، نویسنده، مترجم یا شماره ثبت را وارد کنید.";

        return;

    }

    const filtered = books.filter(book => {

        const t = normalize(book.title);
        const a = normalize(book.author);
        const tr = normalize(book.translator);
        const r = normalize(book.reg);

        return (

            t.includes(q) ||

            a.includes(q) ||

            tr.includes(q) ||

            r.includes(q)

        );

    });

    filtered.sort((x, y) => {

        const xt = normalize(x.title);
        const yt = normalize(y.title);

        if (xt.startsWith(q) && !yt.startsWith(q)) return -1;

        if (!xt.startsWith(q) && yt.startsWith(q)) return 1;

        return xt.localeCompare(yt, "fa");

    });

    show(filtered.slice(0, 20), filtered.length);

});



// ---------- پنجره درباره ----------

const aboutBtn = document.getElementById("aboutBtn");

const aboutModal = document.getElementById("aboutModal");

const closeModal = document.getElementById("closeModal");

aboutBtn.onclick = () => {

    aboutModal.style.display = "block";

};

closeModal.onclick = () => {

    aboutModal.style.display = "none";

};

window.onclick = (e) => {

    if (e.target === aboutModal) {

        aboutModal.style.display = "none";

    }

};
