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

    count.innerHTML = `📚 تعداد کل کتاب‌های کتابخانه: <b>${books.length}</b>`;


});

function show(list){

    results.innerHTML="";

    count.innerHTML=`📖 ${list.length} کتاب یافت شد.`;

    if(list.length===0){

        searchInfo.style.display="none";

        results.innerHTML=`
        <div class="book">
        ❌ کتابی با این مشخصات پیدا نشد.
        </div>`;

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

    if(list.length>=20){

        searchInfo.style.display="block";

        searchInfo.innerHTML=
        `فقط ۲۰ نتیجه اول نمایش داده شده است.
        برای مشاهده نتایج دقیق‌تر، عبارت کامل‌تر یا دقیق‌تری جستجو کنید.`;

    }else{

        searchInfo.style.display="none";

    }

}

    const q = normalize(this.value);

if(q.length < 4){

    results.innerHTML="";

    count.innerHTML=`📚 تعداد کل کتاب‌های کتابخانه: <b>${books.length}</b>`;

    searchInfo.style.display="block";

    searchInfo.innerHTML=
    "برای جستجو حداقل ۴ حرف از عنوان، نویسنده، مترجم یا شماره ثبت را وارد کنید.";

    return;

}

    const filtered = books.filter(book=>{

        const t = normalize(book.title);
        const a = normalize(book.author);
        const tr = normalize(book.translator);
        const r = normalize(book.reg);

        return (
    r !== "" &&
    (
        t.includes(q) ||
        a.includes(q) ||
        tr.includes(q) ||
        r.includes(q)
    )
);

    });

    filtered.sort((x,y)=>{

        const xt = normalize(x.title);
        const yt = normalize(y.title);

        if(xt.startsWith(q) && !yt.startsWith(q)) return -1;
        if(!xt.startsWith(q) && yt.startsWith(q)) return 1;

        return xt.localeCompare(yt,"fa");

    });

    show(filtered.slice(0,20));

});
