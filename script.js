const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMUqn0mNp372-bQKHa5uLhVQT_Jz9ePiriX6KqrdokS1IZZP3IbjqWiBBybvkx9fLFfdZWHaSbz2dQ/pub?output=csv";

const search = document.getElementById("search");
const results = document.getElementById("results");
const count = document.getElementById("count");

let books = [];

fetch(CSV_URL)
  .then(res => res.text())
  .then(text => {

    const rows = text.trim().split("\n");

    const headers = rows[0].split(",");

    books = rows.slice(1).map(row => {
      const cols = row.split(",");

      return {
        title: cols[0] || "",
        author: cols[1] || "",
        translator: cols[2] || "",
        reg: cols[3] || ""
      };
    });

    show(books);
  });

function show(list){

    count.innerHTML="تعداد نتایج: "+list.length;

    results.innerHTML="";

    list.forEach(book=>{

        results.innerHTML+=`
        <div class="book">
            <h3>${book.title}</h3>
            <p>نویسنده: ${book.author}</p>
            <p>مترجم: ${book.translator}</p>
            <p>شماره ثبت: ${book.reg}</p>
        </div>
        `;

    });

}

search.addEventListener("input",function(){

    const q=this.value.trim();

    const filtered=books.filter(b=>

        b.title.includes(q)||
        b.author.includes(q)||
        b.translator.includes(q)||
        b.reg.includes(q)

    );

    show(filtered);

});
