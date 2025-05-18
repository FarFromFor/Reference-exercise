## Obecné poznámky

**Design**

Při psaní hlavní stránky jsem se opíral o vlastní projekty a snažil jsem design napodobit vaši sportovní aplikaci (neříkám, že se mi to povedlo).

**Logika**

Je implementována logika i volby projektu, druhů projektu a jazyků, akorát jelikož v současné fázi všechny tři selecty obsahují každý po jedné možnosti, jsou skryté.  
Zobrazit je lze přepsáním `display: none;` na `display: flex;` na řádku 97 v souboru `style.css`.

Pokud uživatel nezvolí žádný sport/specifikaci, automaticky budou zvoleny všechny.

**Testy**

Jelikož se psaním testů v JS nesetkávám každodenně, bylo to pro mě bolestivé a musel jsem při psaní testů využít umělou inteligenci.  
Konečně ale testy pokrývají jen malou část kódu a nemají skoro žádnou hodnotu. Jelikož jsou ale součástí zadání, nechal jsem je.

**Code style**

God class je jistě antipattern, navíc obsahuje duplicitní logiku týkající se volby bloků sportů a specifikací.  
Nemám už ale čas ji rozdělit do více tříd.

**Více stránek**

Součástí zadání bylo otevírání detailu hráče/týmu na nové stránce, ale vzhledem k malému množství informací na stránce a responzivnějšímu designu jsem to nechal udělat modalem.

## Testy

**Instalace závislostí**

```bash
npm install
```
---

**Spuštění testů**

```bash
npm test
```