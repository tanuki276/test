const ITEMS = [
  {id:1,title:"倭の五王期の諸戦",year:"3〜5世紀頃",desc:`<strong>概要：</strong>中国の史書『宋書』に記録された「倭の五王」の時代に、主に朝鮮半島南部を巡って百済や新羅などの勢力との間で起きたとされる一連の小規模な軍事衝突。この時期の日本の外交的・軍事的活動は、朝鮮半島における権益確保が目的であったと推定されている。しかし、当時の日本の史料は乏しく、その実態については不確定な部分が多い。`, wiki:`倭の五王`},
  {id:2,title:"白村江の戦い",year:"663年",desc:`<strong>概要：</strong>飛鳥時代、朝鮮半島で滅亡の危機に瀕していた同盟国・百済を救援するため、日本（倭国）が唐・新羅の連合軍と戦った国際戦。日本は百済復興を支援すべく、大規模な援軍を派遣したが、白村江（現在の錦江河口）で唐・新羅の水軍に壊滅的な敗北を喫した。この敗戦は、日本の大陸進出を断念させ、国内の防衛体制強化へと方針を転換させる決定的な契機となった。`, wiki:`白村江の戦い`},
  {id:3,title:"前九年・後三年の役",year:"1051–1062年",desc:`<strong>概要：</strong>平安時代中期から後期にかけて、東北地方で起こった豪族間の紛争。前九年の役は、安倍氏と源氏（源頼義・義家）が争い、源氏が勝利して奥州における武家の地位を確立した。後三年の役は、清原氏内部の対立に源義家が介入し、結果として奥州藤原氏の興隆を促した。これらの戦役は、中央政府の支配が及ばない地方における武士の台頭と、その軍事力を利用する構造を象徴している。`, wiki:`前九年の役`},
  {id:4,title:"保元の乱",year:"1156年",desc:`<strong>概要：</strong>平安時代末期、皇位継承問題と摂関家内部の対立が絡み合って起きた内乱。後白河天皇と崇徳上皇がそれぞれを支持する武士団（源義朝、平清盛、源為義など）を巻き込んで激突した。この戦いで勝利した後白河天皇側についた平清盛は大きな権力を手に入れ、後の平氏政権樹立の礎を築いた。武士が朝廷の権力闘争に深く介入し、その影響力を決定づけた初めての戦いとして重要である。`, wiki:`保元の乱`},
  {id:5,title:"平治の乱",year:"1159年",desc:`<strong>概要：</strong>保元の乱からわずか3年後に起きた、平氏と源氏の勢力争いを決定づけた内戦。平治の乱では、平清盛と源義朝が二条天皇を巡って対立。奇襲により一時は源氏側が優勢となるが、清盛が態勢を立て直して反撃し、義朝を敗走させた。この結果、清盛は朝廷内での地位を確固たるものにし、平氏による政権が本格的に始動。源氏の勢力は一時的に壊滅状態に陥った。`, wiki:`平治の乱`},
  {id:6,title:"源平合戦",year:"1180–1185年",desc:`<strong>概要：</strong>治承・寿永の乱とも呼ばれる、平安時代末期の全国的な内乱。源頼朝が伊豆で挙兵し、各地で平氏に反発する武士団が蜂起。源義経や木曽義仲らの活躍により、一ノ谷、屋島、そして決定的な壇ノ浦の戦いなどで平氏は次々と敗れ、最終的に滅亡した。この戦乱は、武士の世の始まりを告げ、鎌倉幕府の成立へと繋がる日本の歴史の大きな転換点となった。`, wiki:`治承・寿永の乱`},
  {id:7,title:"承久の乱",year:"1221年",desc:`<strong>概要：</strong>鎌倉時代、後鳥羽上皇が鎌倉幕府の打倒を目指して挙兵した戦い。上皇は幕府の執権・北条義時追討の院宣（いんぜん）を発し、各地の御家人にも協力を求めた。しかし、北条政子の演説に奮起した幕府軍は、圧倒的な動員力で上皇軍を打ち破った。この勝利により、幕府は朝廷に対する優位性を確立し、西日本への支配を拡大。武家政権の安定が揺るぎないものとなった。`, wiki:`承久の乱`},
  {id:8,title:"元寇（蒙古襲来）",year:"1274・1281年",desc:`<strong>概要：</strong>モンゴル帝国（元）と高麗の連合軍が日本に侵攻した事件。文永の役（1274年）では、元軍が博多湾に上陸し、苦戦を強いられた日本軍は撤退を余儀なくされたが、元軍は台風により撤退。弘安の役（1281年）では、元軍が再度大規模な兵力で襲来するも、防塁の構築や御家人らの奮戦に加え、再びの暴風雨（神風）により壊滅的な打撃を受けた。`, wiki:`元寇`},
  {id:9,title:"南北朝の動乱",year:"1336–1392年",desc:`<strong>概要：</strong>後醍醐天皇の建武の新政崩壊後、北朝（足利氏が擁立）と南朝（後醍醐天皇）に朝廷が分裂して始まった内乱。足利尊氏が室町幕府を開き、北朝と南朝の対立は各地の武士団を巻き込んで全国的な争いとなった。楠木正成らの奮戦も虚しく、最終的に南朝が北朝に屈服する形で合一し、約60年にわたる動乱は終結した。`, wiki:`南北朝時代 (日本)`},
  {id:10,title:"応仁の乱",year:"1467–1477年",desc:`<strong>概要：</strong>室町幕府の将軍後継問題と管領家の家督争いが複合して起きた大乱。細川勝元と山名宗全という二大勢力が京都を二分して11年間にもわたる市街戦を繰り広げた。この戦いは守護大名の力を著しく消耗させ、幕府の権威を失墜させた。その結果、各地で守護代や国人などが台頭し、戦国時代の幕開けを告げる象徴的な出来事となった。`, wiki:`応仁の乱`},
  {id:11,title:"各地の戦国合戦",year:"15〜16世紀",desc:`<strong>概要：</strong>応仁の乱以降の「下剋上」の風潮の中で、各地の戦国大名が覇権を争った大小様々な合戦。織田信長が今川義元を破った「桶狭間の戦い（1560年）」、武田信玄との激戦「三方ヶ原の戦い（1572年）」、鉄砲隊の威力を示した「長篠の戦い（1575年）」など、多様な戦術と政治的な駆け引きが繰り広げられた。`, wiki:`戦国時代 (日本)`},
  {id:12,title:"一向一揆・門徒一揆",year:"15〜16世紀",desc:`<strong>概要：</strong>浄土真宗の門徒が中心となり、各地の守護大名や戦国大名に抵抗して起こした武装蜂起。特に加賀一向一揆は、約100年間も加賀国を支配下に置くなど、強大な勢力を誇った。石山本願寺を拠点とした織田信長との石山合戦は、長期にわたる大規模な戦闘となった。これは宗教的な信仰と武力が結びついた特異な形態の紛争である。`, wiki:`一向一揆`},
  {id:13,title:"豊臣秀吉の全国統一過程の合戦",year:"16世紀後半",desc:`<strong>概要：</strong>織田信長の死後、豊臣秀吉が覇権を握り、全国統一を成し遂げる過程で起きた一連の軍事行動。主なものに、明智光秀を討った「中国大返し（山崎の戦い）」や、島津義久を屈服させた「九州平定」、北条氏を滅ぼした「小田原征伐」などがある。これらの戦いは、各地の戦国大名を次々と従属させ、中央集権的な統一国家の形成を促した。`, wiki:`豊臣秀吉`},
  {id:14,title:"朝鮮出兵（文禄・慶長の役）",year:"1592–1598年",desc:`<strong>概要：</strong>豊臣秀吉が明（中国）への侵攻を最終目的として行った大規模な朝鮮半島への出兵。日本軍は当初、首都の漢城（ソウル）を占領するなど優勢に進めたが、李舜臣率いる朝鮮水軍の活躍や明の援軍により補給線が断たれ、戦況は膠着した。秀吉の死後、日本軍は撤退し、この遠征は双方に甚大な被害を残す結果となった。`, wiki:`文禄・慶長の役`},
  {id:15,title:"島原の乱",year:"1637–1638年",desc:`<strong>概要：</strong>江戸時代初期、九州の肥前国島原と肥後国天草でキリシタンと百姓が幕府の圧政に反発して起こした大規模な一揆。天草四郎を総大将として立て、旧有馬氏の居城である原城に立て籠もった。幕府は多数の兵を動員して鎮圧にあたり、最終的に原城を総攻撃して一揆軍を全滅させた。この乱を機に、幕府は鎖国政策をさらに強化した。`, wiki:`島原の乱`},
  {id:16,title:"打ちこわし・一揆",year:"江戸時代を通じて無数",desc:`<strong>概要：</strong>飢饉や物価高騰などの社会不安を背景に、農村や都市で貧しい人々が富裕な商人や高利貸しを襲撃した集団行動。特に享保・天保・安政期には大規模なものが多発し、幕府や藩の支配体制を揺るがした。これらは支配層との直接的な戦闘というよりは、経済的な不満が爆発した社会現象であり、武力による鎮圧が行われることもあった。`, wiki:`打ちこわし`},
  {id:17,title:"薩英戦争",year:"1863年",desc:`<strong>概要：</strong>幕末、薩摩藩がイギリス商人を殺害した「生麦事件」の賠償交渉が決裂した結果、イギリス艦隊が鹿児島湾に侵入し、薩摩藩と交戦した事件。薩摩藩は最新鋭のイギリス艦隊の圧倒的な火力を前に苦戦したが、果敢に反撃。結果的に和解に至った。この戦いを通じて、薩摩藩は西洋列強の軍事力の優位性を痛感し、後にイギリスと接近する契機となった。`, wiki:`薩英戦争`},
  {id:18,title:"下関戦争",year:"1863–1864年",desc:`<strong>概要：</strong>幕末の攘夷運動が盛んな中、長州藩が下関海峡を通過する外国船を砲撃したことに対する、英・仏・米・蘭四カ国連合艦隊の報復攻撃。連合艦隊は下関の砲台を制圧し、長州藩に甚大な損害を与えた。この敗北により、長州藩は攘夷の無謀さを悟り、開国・倒幕へと方針を転換。薩摩藩と同様に、外国との軍事衝突を通じて近代化の必要性を認識した。`, wiki:`下関戦争`},
  {id:19,title:"戊辰戦争",year:"1868–1869年",desc:`<strong>概要：</strong>王政復古の大号令と大政奉還の後、旧幕府勢力と新政府軍との間で勃発した内戦。鳥羽・伏見の戦いを皮切りに、新政府軍は江戸城を無血開城させ、東北地方の奥羽越列藩同盟や、旧幕府軍残党が立て籠もった蝦夷地（現在の北海道）の五稜郭に至るまで、日本全土を舞台に戦闘が繰り広げられた。この戦いで新政府軍が勝利し、武士の時代が終焉を迎え、明治政府による中央集権国家の体制が確立した。`, wiki:`戊辰戦争`},
  {id:20,title:"台湾出兵",year:"1874年",desc:`<strong>概要：</strong>明治政府が台湾に派兵した軍事行動。1871年に台湾に漂着した琉球漁民が先住民に殺害された事件を口実として、日本は清朝の領土である台湾に出兵した。これは明治政府が初めて行った本格的な海外派兵であり、西郷従道率いる日本軍は台湾南部を制圧。最終的に清朝との交渉で賠償金を得て撤退した。`, wiki:`台湾出兵`},
  {id:21,title:"西南戦争",year:"1877年",desc:`<strong>概要：</strong>明治維新後も特権を失った旧士族の不満が高まる中、西郷隆盛を指導者とする薩摩士族が政府に反乱を起こした。政府は新設の徴兵制による帝国陸軍を投入し、田原坂の戦いなどの激戦を経て、約半年にわたる戦闘の末に反乱を鎮圧。この戦いを最後に、日本の内戦はほぼ終結し、近代的な常備軍が国内の反乱を制圧する能力があることが証明された。`, wiki:`西南戦争`},
  {id:22,title:"日清戦争",year:"1894–1895年",desc:`<strong>概要：</strong>朝鮮半島の支配権を巡る日本と清朝との戦争。開戦は日本軍が豊島沖で清国軍艦を攻撃したことから始まった。陸軍は平壌を、海軍は黄海海戦で清国北洋艦隊を破るなど、日本は各地で勝利を重ね、清朝を圧倒した。結果、下関条約で清は多額の賠償金と台湾・澎湖諸島などを日本に譲渡。この勝利は日本の近代化の成果を国際的に知らしめたが、同時に後の大陸進出へと繋がる端緒となった。`, wiki:`日清戦争`},
  {id:23,title:"日露戦争",year:"1904–1905年",desc:`<strong>概要：</strong>満州と朝鮮半島の権益を巡って、日本とロシアが衝突した国際戦争。日本軍は旅順攻囲戦や奉天会戦で勝利を収め、バルチック艦隊を壊滅させた日本海海戦は歴史的な勝利となった。しかし、国内の疲弊から長期戦は困難となり、アメリカの仲介でポーツマス条約が締結された。日本は南樺太の獲得やポーツマス条約を通じて国際的地位を大きく向上させた。`, wiki:`日露戦争`},
  {id:24,title:"第一次世界大戦",year:"1914–1918年",desc:`<strong>概要：</strong>日本は日英同盟を理由に連合国側として参戦。ドイツが租借していた中国・山東半島の青島を攻略し、太平洋のドイツ領南洋諸島を占領した。これにより、戦後のパリ講和会議でこれらの権益を獲得。大規模な陸上戦闘には関与しなかったが、海軍が地中海で連合国の護衛活動を行うなど、国際的な役割を果たした。`, wiki:`第一次世界大戦下の日本`},
  {id:25,title:"シベリア出兵",year:"1918–1922年",desc:`<strong>概要：</strong>ロシア革命後の混乱期に、日本を含む連合国がロシア領シベリアに軍を派遣した干渉戦争。当初の目的は、孤立したチェコ軍団の救援であったが、各国との思惑の違いから日本軍は長期にわたり駐留を続けた。しかし、軍事的な成果は乏しく、多大な戦費と犠牲を出したことから国内で批判が高まり、最終的に撤退した。`, wiki:`シベリア出兵`},
  {id:26,title:"満州事変",year:"1931–1932年",desc:`<strong>概要：</strong>日本の関東軍が、中国東北部の柳条湖で南満州鉄道の線路を自ら爆破し、これを中国側の仕業として軍事行動を起こした事件。政府の許可なく独断で行動した軍部は、短期間で満州全域を占領し、翌年には傀儡国家である満州国を建国。この事変は、国際社会からの日本の孤立を招き、国内での軍部の発言力を決定的に高める転機となった。`, wiki:`満州事変`},
  {id:27,title:"日中戦争",year:"1937–1945年",desc:`<strong>概要：</strong>盧溝橋事件を契機に始まった、日本と中華民国との全面的な戦争。日本軍は当初、短期決戦で中国を屈服させようとしたが、中国軍の頑強な抵抗により戦線は拡大し、泥沼化した。日本は中国大陸の主要都市を占領するも、広大な国土と民衆の抗戦に苦しんだ。この戦争は日本の国力を著しく消耗させ、後の太平洋戦争へと突き進む大きな要因となった。`, wiki:`日中戦争`},
  {id:28,title:"ノモンハン事件",year:"1939年",desc:`<strong>概要：</strong>満州国とモンゴル人民共和国の国境付近で、関東軍とソ連・モンゴル連合軍が衝突した大規模な軍事紛争。戦車や航空機を駆使したソ連軍の圧倒的な物量の前に、日本軍は決定的な敗北を喫した。この敗北は、日本軍がソ連との本格的な戦争を避ける要因となり、その後の日本の対外方針を北進から南進へと大きく転換させる結果をもたらした。`, wiki:`ノモンハン事件`},
  {id:29,title:"太平洋戦争（大東亜戦争）",year:"1941–1945年",desc:`<strong>概要：</strong>日本が日独伊三国同盟を背景に、アメリカ、イギリスなど連合国を相手に開戦した大規模な戦争。真珠湾攻撃を皮切りに、日本軍は東南アジアや太平洋の島々を次々と占領し、一時的に優勢を保った。しかし、ミッドウェー海戦の敗北を機に戦況は逆転し、連合国の圧倒的な生産力と物量に追い詰められた。最終的に広島と長崎への原爆投下とソ連の参戦を経て、日本はポツダム宣言を受諾し降伏した。`, wiki:`太平洋戦争`},
  {id:30,title:"自衛隊の海外派遣",year:"1990年代〜",desc:`<strong>概要：</strong>冷戦終結後、日本の国際貢献の一環として行われている自衛隊の海外派遣。主なものに、カンボジアや東ティモールなどへの国連平和維持活動（PKO）や、イラク・インド洋での人道支援・復興支援活動がある。これらの活動は、憲法第9条との整合性が常に議論の対象となりつつも、日本の国際的な役割の変化を象徴している。`, wiki:`自衛隊海外派遣`},
  {id:31,title:"池田屋事件",year:"1864年",desc:`<strong>概要：</strong>幕末の京都で、新選組が尊王攘夷派の志士たちが密会していた旅館「池田屋」を急襲した事件。この襲撃により、志士の多くが殺傷され、計画されていた京都での大規模な放火・テロ計画が未然に防がれたとされている。これにより、新選組は幕府の治安維持組織としての名声を高め、尊王攘夷派の勢力は一時的に大きな打撃を被った。`, wiki:`池田屋事件`},
  {id:32,title:"寺田屋事件",year:"1862年/1866年",desc:`<strong>概要：</strong>幕末に京都の伏見にある旅館「寺田屋」で起きた2つの事件。1862年の事件では、薩摩藩の尊王攘夷派の武士たちが暴動を企てたところ、藩主の父である島津久光の命を受けた鎮撫軍に鎮圧された。1866年の事件では、坂本龍馬と長州藩の三吉慎蔵が幕府の捕吏に襲撃されるも、龍馬が護衛の三吉と協力して反撃、辛くも脱出に成功した。`, wiki:`寺田屋事件`},
  {id:33,title:"神風連の乱",year:"1876年",desc:`<strong>概要：</strong>明治政府の急進的な近代化政策、特に廃刀令や徴兵令に反対する旧熊本藩の士族が起こした武装蜂起。中心となったのは、敬神党という不平士族の団体で、彼らは「神風」を信じて、熊本鎮台司令官や県令らを襲撃した。しかし、政府軍の反撃によりわずか数日で鎮圧された。これは、西南戦争に先駆けて起こった代表的な士族反乱の一つである。`, wiki:`神風連の乱`},
  {id:34,title:"日清戦争（台湾平定）",year:"1895年",desc:`<strong>概要：</strong>日清戦争の講和条約である下関条約により、清から日本へ台湾が割譲された。しかし、台湾の住民がこれに反発し、台湾民主国を樹立して抵抗。日本軍は武力による制圧を余儀なくされ、翌年にかけて台湾各地で戦闘が繰り広げられた。日本軍は最終的に台湾全土を支配下に置いたが、この平定作戦は多くの犠牲を出した。`, wiki:`台湾民主国`},
  {id:35,title:"日露戦争（日ソ戦争の対立）",year:"1904–1905年",desc:`<strong>概要：</strong>日露戦争の講和条約であるポーツマス条約により、日本は南樺太を獲得。これに対しロシアは、南樺太への侵攻を試みたが、日本軍の抵抗により失敗。しかし、この地域での国境紛争は継続し、日ソ間の緊張の一因となった。`, wiki:`ポーツマス条約`},
];


// グローバル変数の定義
const LIST = document.getElementById('list');
const Q = document.getElementById('q');
const selectedItems = new Set();
const EXPORT_BUTTON = document.getElementById('export');

// ローカルストレージからのデータ読み込み
function loadSaved(){
  try{ const raw = localStorage.getItem('wars_notes_v4'); if(!raw) return {}; return JSON.parse(raw); }catch(e){return {}} }
function saveAll(data){ localStorage.setItem('wars_notes_v4', JSON.stringify(data)); }
const saved = loadSaved();

// 項目カードのレンダリング
function render(filter=''){
  LIST.innerHTML='';
  const f = filter.trim().toLowerCase();
  const items = ITEMS.filter(it => it.title.toLowerCase().includes(f) || it.year.toLowerCase().includes(f));
  if(items.length===0){
    LIST.innerHTML = '<div class="card">該当する項目がありません。</div>';
    return;
  }
  items.forEach(it=>{
    const card = document.createElement('div');
    card.className='card';
    if(selectedItems.has(it.id)){
      card.classList.add('selected');
    }

    const h = document.createElement('h3');
    h.textContent = it.title;
    h.addEventListener('click', ()=>{
      const d = card.querySelector('.details');
      d.setAttribute('contenteditable','true');
      d.focus();
    });

    const yearElem = document.createElement('div');
    yearElem.className = 'year';
    yearElem.textContent = it.year;

    const meta = document.createElement('div');
    meta.className='meta';
    meta.textContent = '編集可能 — 保存は自動。';

    const det = document.createElement('div');
    det.className='details';
    det.dataset.id = it.id;
    det.innerHTML = (saved[it.id] && saved[it.id].desc) ? saved[it.id].desc : it.desc;

    det.addEventListener('focusout', ()=>{
      const id = det.dataset.id;
      const content = det.innerHTML;
      saved[id] = saved[id] || {};
      saved[id].desc = content;
      saved[id].title = it.title;
      saveAll(saved);
      det.removeAttribute('contenteditable');
    });

    det.addEventListener('keydown',(e)=>{
      if(e.key === 'Escape') {
        det.blur();
      }
      if(e.key === 'Enter' && (e.ctrlKey||e.metaKey)) {
        e.preventDefault();
        det.blur();
      }
    });

    const actions = document.createElement('div');
    actions.className='actions';

    // Wikipediaへのリンクボタン
    const wikiLink = document.createElement('a');
    wikiLink.href = `https://ja.wikipedia.org/wiki/${encodeURIComponent(it.wiki)}`;
    wikiLink.textContent = 'Wikipediaで詳細を見る';
    wikiLink.target = '_blank';
    wikiLink.className = 'wiki-link';

    actions.appendChild(wikiLink);
    card.appendChild(yearElem);
    card.appendChild(h);
    card.appendChild(meta);
    card.appendChild(det);
    card.appendChild(actions);
    
    card.addEventListener('click', (e) => {
        // カード内アクションボタンクリック時は選択しない
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
            return;
        }

        if (selectedItems.has(it.id)) {
            selectedItems.delete(it.id);
            card.classList.remove('selected');
        } else {
            selectedItems.add(it.id);
            card.classList.add('selected');
        }
    });

    LIST.appendChild(card);
  });
}

// イベントリスナーの設定
Q.addEventListener('input', ()=> render(Q.value));

document.getElementById('print').addEventListener('click', ()=> window.print());

EXPORT_BUTTON.addEventListener('click', ()=>{
    if(selectedItems.size === 0) {
        alert("エクスポートする項目を選択してください。");
        return;
    }
    
    const selectedData = ITEMS.filter(it => selectedItems.has(it.id));
    const out = selectedData.map(it => {
        const savedContent = saved[it.id] ? saved[it.id].desc : it.desc;
        const plainText = savedContent.replace(/<[^>]+>/g, '').trim();
        return {
            id: it.id,
            title: it.title,
            year: it.year,
            desc: plainText
        };
    });

    const blob = new Blob([JSON.stringify(out, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_wars_export.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});

// 初期レンダリング
render();
