import mysql from "mysql";

const SakDao = require("./sakdao.js");
const runsqlfile = require("./runsqlfile.js");

// GitLab CI Pool

var pool = mysql.createPool({
  connectionLimit: 1,
  host: "mysql",
  user: "root",
  password: "",
  database: "School",
  debug: false,
  multipleStatements: true
});


 // test
let sakDao = new SakDao(pool);

beforeAll(done => {
  runsqlfile("src/dao/create_tables.sql", pool, () => {
    runsqlfile("src/dao/create_testdata.sql", pool, done);
  });
});

afterAll(() => {
  pool.end();
});

test("get one sak from db", done => {
  sakDao.getOne('Dette er en nyhet', (status, data) => {
    expect(data.length).toBe(1);
    expect(data[0].forfatter).toBe("Marcus Sevaldsen");
    expect(data[0].sak_id).toBe(2);
    done();
  });
});

test("get unknown sak from db", done => {
  sakDao.getOne("null", (status, data) => {
    expect(data.length).toBe(0);
    done();
  });
});

test("get forsidesaker", done =>{
  sakDao.getForside((status,data) =>{
    expect(data.length).toBe(1);
    done();
  });
});

test("get kategorier from database", done => {
  sakDao.getKategorier((status, data) => {
    expect(data.length).toBe(4);
    done();
  });
});

test("get saker gitt kategori-id", done => {
  sakDao.getKategori(1, (status,data) => {
    expect(data.length).toBe(1);
    done();
  });
});

test("add sak to db", done => {
  sakDao.createOne(
    { tittel : "JavaScript har støtte for tester", forfatter : "Engasjert Programmerer",
  bilde : "", importance : 0, innhold : "Denne gjør vi kort", kat_id :  1, ingress : "Kort beskrivelse", bildebeskrivelse: "bilde av noe"},
    callback
  );

  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(status,data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
});

test("get all saker from db", done => {
  sakDao.getAll((status,data) => {
    expect(data.length).toBeGreaterThanOrEqual(2);
    done();
  });
});

test("update sak in database", done => {

    let param = {id : 2, tittel : 'Dette er en nyhet', forfatter : 'Hans Kristian', bilde : 'bilde.no', innhold: 'Saken er oppdatert', kat_id : 1, bildebeskrivelse: 'etellerannet', ingress:'jajakjør'};

    sakDao.updateOne(param, () => {
      sakDao.getOne('Dette er en nyhet', (status, data) => {
        expect(data[0].forfatter).toBe('Hans Kristian');
        expect(data[0].tittel).toBe('Dette er en nyhet');
        expect(data[0].bilde).toBe('bilde.no');
        done();
      })
    })
});

  test("update tittel på sak", done => {
    sakDao.updateTittel({ny : "Tittel er endret", gammel : "Dette er en nyhet"}, () => {
      sakDao.getOne("Tittel er endret", (status,data) => {
        expect(data.length).toBe(1);
        done();
      });
    });
  });


  test("update innhold i sak git tittel", done => {
    sakDao.updateInnhold({innhold : "Nytt innhold i gammel sak", tittel : "Tittel er endret"}, () => {
      sakDao.getOne("Tittel er endret", (status, data) => {
        expect(data[0].innhold).toBe("Nytt innhold i gammel sak");
        done();
      })
    });
  });

  test("delete sak from database", done => {
    sakDao.deleteOne(1, (status, data) => {
      expect(data.affectedRows).toBe(1);
      done();
    });
});


  test("delete gitt tittel", done => {
    sakDao.deleteTittel("Tittel er endret", (status, data) => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });