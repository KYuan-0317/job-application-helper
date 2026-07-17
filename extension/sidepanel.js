const API_BASE = "http://localhost:8787";

const $ = (id) => document.getElementById(id);
const state = { resumes: [], activeResumeId: "", resumeText: "", resumeName: "", pageTitle: "", pageUrl: "", interfaceLanguage: "en" };

const I18N = {
  en: {
    subtitle: "Generate tailored cover letters and application answers from your resume and a pasted job description.", interfaceLanguage: "Interface",
    resumeLabel: "1. Upload resume (PDF / DOCX / TXT)", parseResume: "Parse resume", parsing: "Parsing…", notUploaded: "Not uploaded", loaded: "Loaded", cacheHit: "Loaded from local cache",
    jobDescriptionLabel: "2. Job description", jobDescriptionPlaceholder: "Read it from the current page or paste the complete job description here.", readCurrentPage: "Read current page", readingPage: "Reading…", pageReadSuccess: "Job description loaded", pageReadFailed: "Could not read this page", restrictedPage: "Chrome does not allow extensions to read this page. Open a normal job posting page or paste the description manually.", characters: "characters",
    requirementsLabel: "3. Cover letter requirements", presetStandard: "Standard tailored letter", presetAchievement: "Emphasize measurable achievements", presetMotivation: "Emphasize motivation and company fit", presetEntryLevel: "Student / entry-level", presetCareerChange: "Career change", presetConcise: "Concise and direct", presetCustom: "Custom",
    requirementsPlaceholder: "Example: State the role in the opening; emphasize Python, SQL, and data projects; avoid repeating the resume; end by expressing interest in an interview.", requirementsNote: "You can edit a preset after selecting it. The generated letter will only use facts supported by the resume.",
    tone: "Tone", length: "Length", lengthShort: "Short", lengthMedium: "Medium", lengthLong: "Long", outputLanguage: "Output language", generate: "Generate cover letter", generating: "Generating…",
    resultLabel: "4. Generated result", copy: "Copy", copied: "Copied", save: "Save", saving: "Saving…", resultPlaceholder: "The generated cover letter will appear here and can be edited.",
    applicationQuestionLabel: "5. Job application question", applicationQuestionPlaceholder: "Paste a job application question here, such as: Why are you interested in this role?", answerRequirementsLabel: "Answer requirements (optional)", answerRequirementsPlaceholder: "Example: Maximum 150 words; use a direct and confident tone; mention my analytics project.", generateAnswer: "Generate answer", generatingAnswer: "Generating…", applicationAnswerLabel: "Generated answer", applicationAnswerPlaceholder: "The generated answer will appear here and can be edited.",
    show: "Show", hide: "Hide", saveKey: "Save key", clear: "Clear", notSaved: "Not saved", savedLocally: "Saved on this device", securityNote: "The key is stored only in this Chrome extension on your device and is sent to the local service when generating. Do not save it on a shared computer.",
    enterApiKey: "Enter your OpenAI API key.", invalidApiKey: "The API key format appears incorrect; it should start with sk-.", selectResume: "Select a resume file first.", resumeParseFailed: "Resume parsing failed", serviceCheck: "Make sure the local service is running.", apiKeyFirst: "Enter your OpenAI API key first.", resumeFirst: "Upload and parse your resume first.", jobTooShort: "The job description is too short. Paste the complete job description.", generationFailed: "Generation failed", checkServiceKey: "Check the local service and API key.",
    nothingToSave: "There is no cover letter to save. Generate or enter content first.", docxFailed: "DOCX export failed", pdfFailed: "PDF export failed", questionRequired: "Paste a job application question first.", answerGenerationFailed: "Answer generation failed"
  },
  "zh-CN": {
    subtitle: "根据简历和手动粘贴的职位描述生成定制求职信与申请问题回答。", interfaceLanguage: "界面语言",
    resumeLabel: "1. 上传简历（PDF / DOCX / TXT）", parseResume: "解析简历", parsing: "解析中…", notUploaded: "尚未上传", loaded: "已加载", cacheHit: "已从本地缓存读取",
    jobDescriptionLabel: "2. 职位描述", jobDescriptionPlaceholder: "请在这里粘贴完整的职位描述。", characters: "字符",
    requirementsLabel: "3. Cover Letter 要求", presetStandard: "标准定制版", presetAchievement: "突出量化成果", presetMotivation: "突出申请动机与公司匹配", presetEntryLevel: "学生／应届生版", presetCareerChange: "转行版", presetConcise: "简洁直入主题", presetCustom: "自定义",
    requirementsPlaceholder: "例如：第一段直接说明申请职位；重点突出 Python、SQL 和数据分析项目；避免重复简历内容；结尾加入面试意愿。", requirementsNote: "选择预设后仍可继续修改。生成内容只会使用简历中能够支持的事实。",
    tone: "语气", length: "长度", lengthShort: "短", lengthMedium: "中等", lengthLong: "长", outputLanguage: "输出语言", generate: "生成 Cover Letter", generating: "生成中…",
    resultLabel: "4. 生成结果", copy: "复制", copied: "已复制", save: "保存", saving: "保存中…", resultPlaceholder: "生成的 Cover Letter 会显示在这里，可直接编辑。",
    applicationQuestionLabel: "5. Job Application 问题", applicationQuestionPlaceholder: "粘贴申请表中的问题，例如：Why are you interested in this role?", answerRequirementsLabel: "回答要求（可选）", answerRequirementsPlaceholder: "例如：不超过 150 词；语气直接、自信；提及我的数据分析项目。", generateAnswer: "生成回答", generatingAnswer: "生成中…", applicationAnswerLabel: "生成的回答", applicationAnswerPlaceholder: "生成的回答会显示在这里，可直接编辑。",
    show: "显示", hide: "隐藏", saveKey: "保存 Key", clear: "清除", notSaved: "尚未保存", savedLocally: "已保存在本机", securityNote: "Key 仅保存在本机 Chrome 扩展中，生成时发送给本地服务。共享电脑不建议保存。",
    enterApiKey: "请输入 OpenAI API Key。", invalidApiKey: "API Key 格式看起来不正确，应以 sk- 开头。", selectResume: "请先选择简历文件。", resumeParseFailed: "简历解析失败", serviceCheck: "请确认本地服务已启动。", apiKeyFirst: "请先输入 OpenAI API Key。", resumeFirst: "请先上传并解析简历。", jobTooShort: "Job Description 内容太短，请粘贴完整内容。", generationFailed: "生成失败", checkServiceKey: "请检查本地服务和 API Key。",
    nothingToSave: "没有可保存的 Cover Letter。请先生成或输入内容。", docxFailed: "DOCX 导出失败", pdfFailed: "PDF 导出失败", questionRequired: "请先粘贴 Job Application 问题。", answerGenerationFailed: "回答生成失败"
  },
  "zh-TW": {
    subtitle: "根據履歷和手動貼上的職缺說明產生客製化求職信與申請問題回答。", interfaceLanguage: "介面語言",
    resumeLabel: "1. 上傳履歷（PDF / DOCX / TXT）", parseResume: "解析履歷", parsing: "解析中…", notUploaded: "尚未上傳", loaded: "已載入", cacheHit: "已從本機快取讀取",
    jobDescriptionLabel: "2. 職缺說明", jobDescriptionPlaceholder: "請在這裡貼上完整的職缺說明。", characters: "字元",
    requirementsLabel: "3. Cover Letter 要求", presetStandard: "標準客製版", presetAchievement: "強調量化成果", presetMotivation: "強調申請動機與公司契合度", presetEntryLevel: "學生／新鮮人版", presetCareerChange: "轉職版", presetConcise: "精簡直接", presetCustom: "自訂",
    requirementsPlaceholder: "例如：第一段直接說明申請職位；重點突出 Python、SQL 和資料分析專案；避免重複履歷內容；結尾表達面試意願。", requirementsNote: "選擇預設後仍可繼續修改。產生內容只會使用履歷中可支持的事實。",
    tone: "語氣", length: "長度", lengthShort: "短", lengthMedium: "中等", lengthLong: "長", outputLanguage: "輸出語言", generate: "產生 Cover Letter", generating: "產生中…",
    resultLabel: "4. 產生結果", copy: "複製", copied: "已複製", save: "儲存", saving: "儲存中…", resultPlaceholder: "產生的 Cover Letter 會顯示在這裡，可直接編輯。",
    applicationQuestionLabel: "5. Job Application 問題", applicationQuestionPlaceholder: "貼上申請表中的問題，例如：Why are you interested in this role?", answerRequirementsLabel: "回答要求（選填）", answerRequirementsPlaceholder: "例如：不超過 150 字；語氣直接、自信；提及我的資料分析專案。", generateAnswer: "產生回答", generatingAnswer: "產生中…", applicationAnswerLabel: "產生的回答", applicationAnswerPlaceholder: "產生的回答會顯示在這裡，可直接編輯。",
    show: "顯示", hide: "隱藏", saveKey: "儲存 Key", clear: "清除", notSaved: "尚未儲存", savedLocally: "已儲存在本機", securityNote: "Key 僅儲存在本機 Chrome 擴充功能中，產生時傳送給本機服務。共用電腦不建議儲存。",
    enterApiKey: "請輸入 OpenAI API Key。", invalidApiKey: "API Key 格式似乎不正確，應以 sk- 開頭。", selectResume: "請先選擇履歷檔案。", resumeParseFailed: "履歷解析失敗", serviceCheck: "請確認本機服務已啟動。", apiKeyFirst: "請先輸入 OpenAI API Key。", resumeFirst: "請先上傳並解析履歷。", jobTooShort: "職缺說明內容太短，請貼上完整內容。", generationFailed: "產生失敗", checkServiceKey: "請檢查本機服務和 API Key。",
    nothingToSave: "沒有可儲存的 Cover Letter。請先產生或輸入內容。", docxFailed: "DOCX 匯出失敗", pdfFailed: "PDF 匯出失敗", questionRequired: "請先貼上 Job Application 問題。", answerGenerationFailed: "回答產生失敗"
  },
  fr: {
    subtitle: "Générez une lettre de motivation et des réponses à partir de votre CV et d’une offre collée manuellement.", interfaceLanguage: "Interface",
    resumeLabel: "1. Importer le CV (PDF / DOCX / TXT)", parseResume: "Analyser le CV", parsing: "Analyse…", notUploaded: "Non importé", loaded: "Importé",
    jobDescriptionLabel: "2. Description du poste", jobDescriptionPlaceholder: "Collez ici la description complète du poste.", characters: "caractères",
    requirementsLabel: "3. Exigences de la lettre de motivation", presetStandard: "Lettre personnalisée standard", presetAchievement: "Mettre en avant les résultats mesurables", presetMotivation: "Mettre en avant la motivation et l’adéquation", presetEntryLevel: "Étudiant / débutant", presetCareerChange: "Reconversion professionnelle", presetConcise: "Concis et direct", presetCustom: "Personnalisé",
    requirementsPlaceholder: "Exemple : nommer le poste dès l’introduction, mettre en avant Python, SQL et les projets de données, éviter de répéter le CV et terminer par une demande d’entretien.", requirementsNote: "Vous pouvez modifier un modèle après l’avoir sélectionné. Seuls les faits confirmés par le CV seront utilisés.",
    tone: "Ton", length: "Longueur", lengthShort: "Courte", lengthMedium: "Moyenne", lengthLong: "Longue", outputLanguage: "Langue de sortie", generate: "Générer la lettre", generating: "Génération…",
    resultLabel: "4. Résultat généré", copy: "Copier", copied: "Copié", save: "Enregistrer", saving: "Enregistrement…", resultPlaceholder: "La lettre générée apparaîtra ici et pourra être modifiée.",
    applicationQuestionLabel: "5. Question de candidature", applicationQuestionPlaceholder: "Collez une question de candidature, par exemple : Pourquoi ce poste vous intéresse-t-il ?", answerRequirementsLabel: "Consignes de réponse (facultatif)", answerRequirementsPlaceholder: "Exemple : 150 mots maximum, ton direct et confiant, mentionner mon projet d’analyse.", generateAnswer: "Générer la réponse", generatingAnswer: "Génération…", applicationAnswerLabel: "Réponse générée", applicationAnswerPlaceholder: "La réponse générée apparaîtra ici et pourra être modifiée.",
    show: "Afficher", hide: "Masquer", saveKey: "Enregistrer la clé", clear: "Effacer", notSaved: "Non enregistrée", savedLocally: "Enregistrée sur cet appareil", securityNote: "La clé est conservée uniquement dans cette extension sur cet appareil et transmise au service local lors de la génération. Ne l’enregistrez pas sur un ordinateur partagé.",
    enterApiKey: "Saisissez votre clé API OpenAI.", invalidApiKey: "Le format de la clé semble incorrect ; elle doit commencer par sk-.", selectResume: "Sélectionnez d’abord un CV.", resumeParseFailed: "Échec de l’analyse du CV", serviceCheck: "Vérifiez que le service local est démarré.", apiKeyFirst: "Saisissez d’abord votre clé API OpenAI.", resumeFirst: "Importez et analysez d’abord votre CV.", jobTooShort: "La description du poste est trop courte. Lisez la page ou collez la description complète.", generationFailed: "Échec de la génération", checkServiceKey: "Vérifiez le service local et la clé API.", nothingToSave: "Aucune lettre à enregistrer.", docxFailed: "Échec de l’export DOCX", pdfFailed: "Échec de l’export PDF", questionRequired: "Collez d’abord une question de candidature.", answerGenerationFailed: "Échec de la génération de la réponse"
  },
  es: {
    subtitle: "Genera una carta de presentación personalizada a partir de tu currículum y la oferta actual.", interfaceLanguage: "Interfaz",
    resumeLabel: "1. Subir currículum (PDF / DOCX / TXT)", parseResume: "Analizar currículum", parsing: "Analizando…", notUploaded: "No subido", loaded: "Cargado", jobDescriptionLabel: "2. Descripción del puesto de la página actual", jobDescriptionPlaceholder: "También puedes pegar aquí la descripción del puesto.", characters: "caracteres",
    requirementsLabel: "3. Requisitos de la carta", presetStandard: "Carta personalizada estándar", presetAchievement: "Destacar logros medibles", presetMotivation: "Destacar motivación y encaje", presetEntryLevel: "Estudiante / nivel inicial", presetCareerChange: "Cambio de carrera", presetConcise: "Concisa y directa", presetCustom: "Personalizada", requirementsPlaceholder: "Ejemplo: indicar el puesto al inicio; destacar Python, SQL y proyectos de datos; evitar repetir el currículum; terminar mostrando interés en una entrevista.", requirementsNote: "Puedes editar una plantilla después de seleccionarla. Solo se usarán datos respaldados por el currículum.",
    tone: "Tono", length: "Longitud", lengthShort: "Corta", lengthMedium: "Media", lengthLong: "Larga", outputLanguage: "Idioma de salida", generate: "Generar carta", generating: "Generando…", resultLabel: "4. Resultado generado", copy: "Copiar", copied: "Copiado", save: "Guardar", saving: "Guardando…", resultPlaceholder: "La carta generada aparecerá aquí y podrá editarse.", applicationQuestionLabel: "5. Pregunta de solicitud", applicationQuestionPlaceholder: "Pega una pregunta, por ejemplo: ¿Por qué te interesa este puesto?", answerRequirementsLabel: "Requisitos de respuesta (opcional)", answerRequirementsPlaceholder: "Ejemplo: máximo 150 palabras; tono directo y seguro; mencionar mi proyecto de análisis.", generateAnswer: "Generar respuesta", generatingAnswer: "Generando…", applicationAnswerLabel: "Respuesta generada", applicationAnswerPlaceholder: "La respuesta generada aparecerá aquí y podrá editarse.", show: "Mostrar", hide: "Ocultar", saveKey: "Guardar clave", clear: "Borrar", notSaved: "No guardada", savedLocally: "Guardada en este dispositivo", securityNote: "La clave se guarda solo en esta extensión y se envía al servicio local al generar. No la guardes en un equipo compartido.", enterApiKey: "Introduce tu clave API de OpenAI.", invalidApiKey: "El formato parece incorrecto; debe comenzar por sk-.", selectResume: "Selecciona primero un currículum.", resumeParseFailed: "Error al analizar el currículum", serviceCheck: "Comprueba que el servicio local esté activo.", apiKeyFirst: "Introduce primero tu clave API.", resumeFirst: "Sube y analiza primero tu currículum.", jobTooShort: "La descripción es demasiado corta. Lee la página o pega el texto completo.", generationFailed: "Error de generación", checkServiceKey: "Comprueba el servicio local y la clave API.", nothingToSave: "No hay una carta para guardar.", docxFailed: "Error de exportación DOCX", pdfFailed: "Error de exportación PDF", questionRequired: "Pega primero una pregunta de solicitud.", answerGenerationFailed: "Error al generar la respuesta"
  },
  de: {
    subtitle: "Erstellen Sie ein passendes Anschreiben aus Ihrem Lebenslauf und der aktuellen Stellenanzeige.", interfaceLanguage: "Oberfläche",
    resumeLabel: "1. Lebenslauf hochladen (PDF / DOCX / TXT)", parseResume: "Lebenslauf analysieren", parsing: "Analyse…", notUploaded: "Nicht hochgeladen", loaded: "Geladen", jobDescriptionLabel: "2. Stellenbeschreibung der aktuellen Seite", jobDescriptionPlaceholder: "Sie können die Stellenbeschreibung auch hier einfügen.", characters: "Zeichen", requirementsLabel: "3. Anforderungen an das Anschreiben", presetStandard: "Standardmäßig angepasst", presetAchievement: "Messbare Erfolge hervorheben", presetMotivation: "Motivation und Passung hervorheben", presetEntryLevel: "Studium / Berufseinstieg", presetCareerChange: "Berufswechsel", presetConcise: "Kurz und direkt", presetCustom: "Benutzerdefiniert", requirementsPlaceholder: "Beispiel: Stelle in der Einleitung nennen; Python, SQL und Datenprojekte hervorheben; Wiederholungen vermeiden; Interesse an einem Gespräch ausdrücken.", requirementsNote: "Eine Vorlage kann nach der Auswahl bearbeitet werden. Es werden nur durch den Lebenslauf belegte Fakten verwendet.", tone: "Ton", length: "Länge", lengthShort: "Kurz", lengthMedium: "Mittel", lengthLong: "Lang", outputLanguage: "Ausgabesprache", generate: "Anschreiben erstellen", generating: "Wird erstellt…", resultLabel: "4. Ergebnis", copy: "Kopieren", copied: "Kopiert", save: "Speichern", saving: "Speichern…", resultPlaceholder: "Das erstellte Anschreiben erscheint hier und kann bearbeitet werden.", applicationQuestionLabel: "5. Bewerbungsfrage", applicationQuestionPlaceholder: "Fügen Sie eine Bewerbungsfrage ein, z. B.: Warum interessieren Sie sich für diese Stelle?", answerRequirementsLabel: "Antwortvorgaben (optional)", answerRequirementsPlaceholder: "Beispiel: höchstens 150 Wörter; direkt und selbstbewusst; Analyseprojekt erwähnen.", generateAnswer: "Antwort erstellen", generatingAnswer: "Wird erstellt…", applicationAnswerLabel: "Erstellte Antwort", applicationAnswerPlaceholder: "Die erstellte Antwort erscheint hier und kann bearbeitet werden.", show: "Anzeigen", hide: "Ausblenden", saveKey: "Schlüssel speichern", clear: "Löschen", notSaved: "Nicht gespeichert", savedLocally: "Auf diesem Gerät gespeichert", securityNote: "Der Schlüssel wird nur in dieser Erweiterung gespeichert und bei der Generierung an den lokalen Dienst gesendet. Nicht auf gemeinsam genutzten Geräten speichern.", enterApiKey: "Geben Sie Ihren OpenAI-API-Schlüssel ein.", invalidApiKey: "Das Format scheint falsch; der Schlüssel sollte mit sk- beginnen.", selectResume: "Wählen Sie zuerst einen Lebenslauf.", resumeParseFailed: "Lebenslauf konnte nicht analysiert werden", serviceCheck: "Prüfen Sie, ob der lokale Dienst läuft.", apiKeyFirst: "Geben Sie zuerst den API-Schlüssel ein.", resumeFirst: "Laden und analysieren Sie zuerst Ihren Lebenslauf.", jobTooShort: "Die Stellenbeschreibung ist zu kurz. Lesen Sie die Seite oder fügen Sie den vollständigen Text ein.", generationFailed: "Erstellung fehlgeschlagen", checkServiceKey: "Prüfen Sie den lokalen Dienst und den API-Schlüssel.", nothingToSave: "Es gibt kein Anschreiben zum Speichern.", docxFailed: "DOCX-Export fehlgeschlagen", pdfFailed: "PDF-Export fehlgeschlagen", questionRequired: "Fügen Sie zuerst eine Bewerbungsfrage ein.", answerGenerationFailed: "Antwort konnte nicht erstellt werden"
  },
  ja: {
    subtitle: "履歴書と現在の求人ページから、応募先に合わせたカバーレターを作成します。", interfaceLanguage: "表示言語", resumeLabel: "1. 履歴書をアップロード（PDF / DOCX / TXT）", parseResume: "履歴書を解析", parsing: "解析中…", notUploaded: "未アップロード", loaded: "読み込み済み", jobDescriptionLabel: "2. 現在のページの求人情報", jobDescriptionPlaceholder: "求人情報をここに貼り付けることもできます。", characters: "文字", requirementsLabel: "3. カバーレターの要件", presetStandard: "標準カスタマイズ", presetAchievement: "数値で示せる実績を重視", presetMotivation: "志望動機と適合性を重視", presetEntryLevel: "学生／新卒向け", presetCareerChange: "キャリアチェンジ", presetConcise: "簡潔で直接的", presetCustom: "カスタム", requirementsPlaceholder: "例：冒頭で職種名を明記し、Python・SQL・データ分析プロジェクトを強調し、履歴書の繰り返しを避け、面接への意欲で締める。", requirementsNote: "プリセット選択後も編集できます。履歴書で確認できる事実のみを使用します。", tone: "トーン", length: "長さ", lengthShort: "短い", lengthMedium: "標準", lengthLong: "長い", outputLanguage: "出力言語", generate: "カバーレターを作成", generating: "作成中…", resultLabel: "4. 作成結果", copy: "コピー", copied: "コピー済み", save: "保存", saving: "保存中…", resultPlaceholder: "作成されたカバーレターがここに表示され、編集できます。", applicationQuestionLabel: "5. 応募フォームの質問", applicationQuestionPlaceholder: "質問を貼り付けてください。例：この職種に興味を持った理由は何ですか？", answerRequirementsLabel: "回答要件（任意）", answerRequirementsPlaceholder: "例：150語以内、直接的で自信のある文体、分析プロジェクトに触れる。", generateAnswer: "回答を作成", generatingAnswer: "作成中…", applicationAnswerLabel: "作成された回答", applicationAnswerPlaceholder: "作成された回答がここに表示され、編集できます。", show: "表示", hide: "非表示", saveKey: "キーを保存", clear: "クリア", notSaved: "未保存", savedLocally: "この端末に保存済み", securityNote: "キーはこの端末の拡張機能内にのみ保存され、生成時にローカルサービスへ送信されます。共有PCには保存しないでください。", enterApiKey: "OpenAI APIキーを入力してください。", invalidApiKey: "APIキーの形式が正しくないようです。sk- で始まる必要があります。", selectResume: "先に履歴書ファイルを選択してください。", resumeParseFailed: "履歴書の解析に失敗しました", serviceCheck: "ローカルサービスが起動しているか確認してください。", apiKeyFirst: "先にOpenAI APIキーを入力してください。", resumeFirst: "先に履歴書をアップロードして解析してください。", jobTooShort: "求人情報が短すぎます。ページを読み取るか、全文を貼り付けてください。", generationFailed: "生成に失敗しました", checkServiceKey: "ローカルサービスとAPIキーを確認してください。", nothingToSave: "保存するカバーレターがありません。", docxFailed: "DOCX出力に失敗しました", pdfFailed: "PDF出力に失敗しました", questionRequired: "先に応募フォームの質問を貼り付けてください。", answerGenerationFailed: "回答の生成に失敗しました"
  },
  ko: {
    subtitle: "이력서와 현재 채용 페이지를 바탕으로 맞춤형 커버레터를 생성합니다.", interfaceLanguage: "인터페이스", resumeLabel: "1. 이력서 업로드 (PDF / DOCX / TXT)", parseResume: "이력서 분석", parsing: "분석 중…", notUploaded: "업로드되지 않음", loaded: "불러옴", jobDescriptionLabel: "2. 현재 페이지의 직무 설명", jobDescriptionPlaceholder: "직무 설명을 여기에 직접 붙여넣을 수도 있습니다.", characters: "자", requirementsLabel: "3. 커버레터 요구사항", presetStandard: "표준 맞춤형", presetAchievement: "측정 가능한 성과 강조", presetMotivation: "지원 동기와 적합성 강조", presetEntryLevel: "학생／신입", presetCareerChange: "커리어 전환", presetConcise: "간결하고 직접적", presetCustom: "사용자 지정", requirementsPlaceholder: "예: 첫 문단에 지원 직무를 명시하고 Python, SQL 및 데이터 프로젝트를 강조하며 이력서 반복을 피하고 면접 의사로 마무리합니다.", requirementsNote: "프리셋을 선택한 뒤에도 수정할 수 있습니다. 이력서로 확인되는 사실만 사용합니다.", tone: "어조", length: "길이", lengthShort: "짧게", lengthMedium: "보통", lengthLong: "길게", outputLanguage: "출력 언어", generate: "커버레터 생성", generating: "생성 중…", resultLabel: "4. 생성 결과", copy: "복사", copied: "복사됨", save: "저장", saving: "저장 중…", resultPlaceholder: "생성된 커버레터가 여기에 표시되며 수정할 수 있습니다.", applicationQuestionLabel: "5. 지원서 질문", applicationQuestionPlaceholder: "지원서 질문을 붙여넣으세요. 예: 이 직무에 관심을 가진 이유는 무엇인가요?", answerRequirementsLabel: "답변 요구사항 (선택)", answerRequirementsPlaceholder: "예: 150단어 이내, 직접적이고 자신감 있는 어조, 분석 프로젝트 언급.", generateAnswer: "답변 생성", generatingAnswer: "생성 중…", applicationAnswerLabel: "생성된 답변", applicationAnswerPlaceholder: "생성된 답변이 여기에 표시되며 수정할 수 있습니다.", show: "표시", hide: "숨기기", saveKey: "키 저장", clear: "지우기", notSaved: "저장되지 않음", savedLocally: "이 기기에 저장됨", securityNote: "키는 이 기기의 확장 프로그램에만 저장되며 생성 시 로컬 서비스로 전송됩니다. 공용 컴퓨터에는 저장하지 마세요.", enterApiKey: "OpenAI API 키를 입력하세요.", invalidApiKey: "API 키 형식이 올바르지 않습니다. sk-로 시작해야 합니다.", selectResume: "먼저 이력서 파일을 선택하세요.", resumeParseFailed: "이력서 분석 실패", serviceCheck: "로컬 서비스가 실행 중인지 확인하세요.", apiKeyFirst: "먼저 OpenAI API 키를 입력하세요.", resumeFirst: "먼저 이력서를 업로드하고 분석하세요.", jobTooShort: "직무 설명이 너무 짧습니다. 페이지를 읽거나 전체 내용을 붙여넣으세요.", generationFailed: "생성 실패", checkServiceKey: "로컬 서비스와 API 키를 확인하세요.", nothingToSave: "저장할 커버레터가 없습니다.", docxFailed: "DOCX 내보내기 실패", pdfFailed: "PDF 내보내기 실패", questionRequired: "먼저 지원서 질문을 붙여넣으세요.", answerGenerationFailed: "답변 생성 실패"
  }
};


const EXTRA_I18N = {
  en: { resumeLabel: "1. Resume library (PDF / DOCX / TXT)", addResumes: "Add resume(s)", activeResume: "Active resume", deleteResume: "Delete", noResumes: "No resumes", resumesAvailable: "resumes available", answerTone: "Answer tone", wordLimit: "Word limit", noLimit: "No fixed limit", answerStyle: "Answer type", answerBalanced: "Balanced", answerMotivation: "Motivation / fit", answerAchievement: "Achievement-focused", answerBehavioral: "Behavioral / STAR", answerConcise: "Concise", customAnswerRequirements: "Additional instructions (optional)", answerRequirementsLabel: "Job application answer requirements" },
  "zh-CN": { resumeLabel: "1. 多版本简历库（PDF / DOCX / TXT）", addResumes: "添加简历", activeResume: "当前使用的简历", deleteResume: "删除", noResumes: "暂无简历", resumesAvailable: "份简历可用", answerTone: "回答语气", wordLimit: "字数限制", noLimit: "不限", answerStyle: "回答类型", answerBalanced: "综合回答", answerMotivation: "动机／匹配度", answerAchievement: "突出成果", answerBehavioral: "行为题／STAR", answerConcise: "简洁回答", customAnswerRequirements: "补充要求（可选）", answerRequirementsLabel: "Job Application 回答要求" },
  "zh-TW": { resumeLabel: "1. 多版本履歷庫（PDF / DOCX / TXT）", addResumes: "新增履歷", activeResume: "目前使用的履歷", deleteResume: "刪除", noResumes: "暫無履歷", resumesAvailable: "份履歷可用", answerTone: "回答語氣", wordLimit: "字數限制", noLimit: "不限", answerStyle: "回答類型", answerBalanced: "綜合回答", answerMotivation: "動機／契合度", answerAchievement: "強調成果", answerBehavioral: "行為題／STAR", answerConcise: "精簡回答", customAnswerRequirements: "補充要求（選填）", answerRequirementsLabel: "Job Application 回答要求" }
};
for (const [locale, values] of Object.entries(EXTRA_I18N)) Object.assign(I18N[locale], values);

const COVER_SETTINGS_I18N = {
  en: { coverSettings: "Cover letter settings", coverType: "Letter type", customCoverRequirements: "Additional instructions (optional)" },
  "zh-CN": { coverSettings: "Cover Letter 设置", coverType: "类型", customCoverRequirements: "补充要求（可选）" },
  "zh-TW": { coverSettings: "Cover Letter 設定", coverType: "類型", customCoverRequirements: "補充要求（選填）" },
  fr: { coverSettings: "Paramètres de la lettre", coverType: "Type de lettre", customCoverRequirements: "Instructions supplémentaires (facultatif)" },
  es: { coverSettings: "Configuración de la carta", coverType: "Tipo de carta", customCoverRequirements: "Instrucciones adicionales (opcional)" },
  de: { coverSettings: "Anschreiben-Einstellungen", coverType: "Art des Anschreibens", customCoverRequirements: "Zusätzliche Anweisungen (optional)" },
  ja: { coverSettings: "カバーレター設定", coverType: "レターの種類", customCoverRequirements: "追加の指示（任意）" },
  ko: { coverSettings: "커버레터 설정", coverType: "레터 유형", customCoverRequirements: "추가 지침 (선택)" }
};
for (const [locale, values] of Object.entries(COVER_SETTINGS_I18N)) Object.assign(I18N[locale], values);

const PAGE_READ_I18N = {
  "zh-CN": { readCurrentPage: "读取当前页面", readingPage: "读取中…", pageReadSuccess: "职位描述已读取", pageReadFailed: "无法读取当前页面", restrictedPage: "Chrome 不允许插件读取此页面。请打开普通招聘页面，或手动粘贴职位描述。", jobDescriptionPlaceholder: "可读取当前页面，或在这里粘贴完整的职位描述。" },
  "zh-TW": { readCurrentPage: "讀取目前頁面", readingPage: "讀取中…", pageReadSuccess: "職缺說明已讀取", pageReadFailed: "無法讀取目前頁面", restrictedPage: "Chrome 不允許擴充功能讀取此頁面。請開啟一般招聘頁面，或手動貼上職缺說明。", jobDescriptionPlaceholder: "可讀取目前頁面，或在這裡貼上完整的職缺說明。" },
  fr: { readCurrentPage: "Lire la page actuelle", readingPage: "Lecture…", pageReadSuccess: "Description du poste chargée", pageReadFailed: "Impossible de lire cette page", restrictedPage: "Chrome n’autorise pas l’extension à lire cette page. Ouvrez une offre d’emploi normale ou collez la description manuellement.", jobDescriptionPlaceholder: "Lisez la page actuelle ou collez ici la description complète du poste." },
  es: { readCurrentPage: "Leer página actual", readingPage: "Leyendo…", pageReadSuccess: "Descripción del puesto cargada", pageReadFailed: "No se pudo leer esta página", restrictedPage: "Chrome no permite que la extensión lea esta página. Abra una oferta normal o pegue la descripción manualmente.", jobDescriptionPlaceholder: "Lea la página actual o pegue aquí la descripción completa del puesto." },
  de: { readCurrentPage: "Aktuelle Seite lesen", readingPage: "Wird gelesen…", pageReadSuccess: "Stellenbeschreibung geladen", pageReadFailed: "Diese Seite konnte nicht gelesen werden", restrictedPage: "Chrome erlaubt der Erweiterung nicht, diese Seite zu lesen. Öffnen Sie eine normale Stellenanzeige oder fügen Sie den Text manuell ein.", jobDescriptionPlaceholder: "Aktuelle Seite lesen oder vollständige Stellenbeschreibung hier einfügen." },
  ja: { readCurrentPage: "現在のページを読み取る", readingPage: "読み取り中…", pageReadSuccess: "求人情報を読み取りました", pageReadFailed: "このページを読み取れませんでした", restrictedPage: "Chromeでは拡張機能がこのページを読み取れません。通常の求人ページを開くか、求人情報を手動で貼り付けてください。", jobDescriptionPlaceholder: "現在のページを読み取るか、求人情報をここに貼り付けてください。" },
  ko: { readCurrentPage: "현재 페이지 읽기", readingPage: "읽는 중…", pageReadSuccess: "직무 설명을 불러왔습니다", pageReadFailed: "이 페이지를 읽을 수 없습니다", restrictedPage: "Chrome은 확장 프로그램이 이 페이지를 읽는 것을 허용하지 않습니다. 일반 채용 공고 페이지를 열거나 내용을 직접 붙여넣으세요.", jobDescriptionPlaceholder: "현재 페이지를 읽거나 전체 직무 설명을 여기에 붙여넣으세요." }
};
for (const [locale, values] of Object.entries(PAGE_READ_I18N)) Object.assign(I18N[locale], values);

const REQUIREMENT_PRESETS = {
  standard: "Write a tailored, professional cover letter. Open by naming the role, connect the strongest resume evidence to the most important job requirements, avoid repeating the resume line by line, and end with a clear expression of interest in an interview.",
  achievement: "Prioritize measurable achievements and concrete impact. Use the strongest supported metrics from the resume, explain how those results relate to this role, and keep general claims to a minimum.",
  motivation: "Emphasize why this role and company are a strong match. Connect the candidate's background, interests, and relevant experience to the employer's mission, products, team, or responsibilities described in the job posting.",
  entryLevel: "Write for a student or early-career applicant. Highlight relevant coursework, projects, internships, transferable skills, and learning ability without apologizing for limited experience.",
  careerChange: "Write for a career transition. Clearly connect transferable skills and relevant accomplishments from the previous field to the new role, explain the transition positively, and avoid sounding defensive.",
  concise: "Be direct and concise. Use short paragraphs, focus on the top two or three job requirements, include only the strongest evidence, and avoid clichés or unnecessary background.",
  custom: ""
};

function t(key) { return I18N[state.interfaceLanguage]?.[key] || I18N.en[key] || key; }

function syncActiveResume() {
  const active = state.resumes.find((resume) => resume.id === state.activeResumeId) || state.resumes[0] || null;
  state.activeResumeId = active?.id || "";
  state.resumeText = active?.text || "";
  state.resumeName = active?.name || "";
}

function renderResumeSelector() {
  const list = $("resumeList");
  list.innerHTML = "";
  if (!state.resumes.length) {
    const empty = document.createElement("div");
    empty.className = "resume-list-empty";
    empty.textContent = t("noResumes");
    list.appendChild(empty);
    $("resumeStatus").textContent = t("noResumes");
    return;
  }

  for (const resume of state.resumes) {
    const row = document.createElement("div");
    row.className = `resume-list-item${resume.id === state.activeResumeId ? " active" : ""}`;
    row.dataset.resumeId = resume.id;

    const info = document.createElement("button");
    info.type = "button";
    info.className = "resume-select-area";
    info.dataset.action = "select-resume";
    info.dataset.resumeId = resume.id;

    const name = document.createElement("span");
    name.className = "resume-file-name";
    name.textContent = resume.name;
    const meta = document.createElement("span");
    meta.className = "resume-file-meta";
    meta.textContent = `${Number(resume.characters || resume.text?.length || 0).toLocaleString()} ${t("characters")}`;
    info.append(name, meta);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "resume-row-delete";
    remove.dataset.action = "delete-resume";
    remove.dataset.resumeId = resume.id;
    remove.textContent = "×";
    remove.title = t("deleteResume");
    remove.setAttribute("aria-label", `${t("deleteResume")}: ${resume.name}`);

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "activeResume";
    radio.value = resume.id;
    radio.checked = resume.id === state.activeResumeId;
    radio.dataset.action = "select-resume";
    radio.dataset.resumeId = resume.id;
    radio.setAttribute("aria-label", `${t("activeResume")}: ${resume.name}`);

    row.append(info, remove, radio);
    list.appendChild(row);
  }
  $("resumeStatus").textContent = `${state.resumes.length} ${t("resumesAvailable")}`;
}

function updateCoverRequirementsSummary() {
  const summary = $("coverRequirementsSummary");
  if (!summary) return;
  summary.textContent = t("coverSettings");
}

function applyInterfaceLanguage(language) {
  state.interfaceLanguage = I18N[language] ? language : "en";
  document.documentElement.lang = state.interfaceLanguage;
  $("interfaceLanguage").value = state.interfaceLanguage;
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = t(node.dataset.i18nPlaceholder); });
  $("toggleApiKey").textContent = $("apiKey").type === "text" ? t("hide") : t("show");
  $("apiKeyStatus").textContent = $("apiKey").value ? t("savedLocally") : t("notSaved");
  renderResumeSelector();
  updateCoverRequirementsSummary();
}

function safeFilenameBase() {
  const title = (state.pageTitle || "cover-letter").replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
  return title || "cover-letter";
}
function downloadBlob(blob, filename) { const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
async function saveAsDocx(text) { const response = await fetch(`${API_BASE}/api/export-docx`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coverLetter: text }) }); if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.error || t("docxFailed")); } downloadBlob(await response.blob(), `${safeFilenameBase()}.docx`); }
async function saveAsPdf(text) { const response = await fetch(`${API_BASE}/api/export-pdf`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coverLetter: text }) }); if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.error || t("pdfFailed")); } downloadBlob(await response.blob(), `${safeFilenameBase()}.pdf`); }

async function restoreState() {
  const saved = await chrome.storage.local.get(["apiKey", "resumes", "activeResumeId", "resumeText", "resumeName", "jobDescription", "tone", "length", "language", "requirementPreset", "coverLetterRequirements", "interfaceLanguage", "applicationQuestion", "answerRequirements", "applicationAnswer", "answerTone", "answerWordLimit", "answerStyle"]);
  state.interfaceLanguage = saved.interfaceLanguage || "en";
  $("apiKey").value = saved.apiKey || "";
  state.resumes = Array.isArray(saved.resumes) ? saved.resumes : [];
  if (!state.resumes.length && saved.resumeText) state.resumes = [{ id: `legacy-${Date.now()}`, name: saved.resumeName || "Resume", text: saved.resumeText, characters: saved.resumeText.length }];
  state.activeResumeId = saved.activeResumeId || state.resumes[0]?.id || "";
  syncActiveResume();
  $("jobDescription").value = saved.jobDescription || "";
  $("tone").value = saved.tone || "professional";
  $("length").value = saved.length || "medium";
  $("language").value = saved.language || "English";
  const preset = saved.requirementPreset || "standard";
  $("requirementPreset").value = REQUIREMENT_PRESETS[preset] !== undefined ? preset : "standard";
  $("coverLetterRequirements").value = saved.coverLetterRequirements ?? REQUIREMENT_PRESETS[$("requirementPreset").value];
  $("applicationQuestion").value = saved.applicationQuestion || "";
  $("answerRequirements").value = saved.answerRequirements || "";
  $("applicationAnswer").value = saved.applicationAnswer || "";
  $("answerTone").value = saved.answerTone || "professional";
  $("answerWordLimit").value = saved.answerWordLimit || "150";
  $("answerStyle").value = saved.answerStyle || "balanced";
  applyInterfaceLanguage(state.interfaceLanguage);
}

function setBusy(button, busy, busyKey, normalKey) { button.disabled = busy; button.textContent = t(busy ? busyKey : normalKey); }
const FEEDBACK_IDS = ["resumeError", "jobError", "coverError", "saveError", "answerError", "apiError"];
function clearFeedback(target) {
  if (target) { $(target).textContent = ""; return; }
  FEEDBACK_IDS.forEach((id) => { $(id).textContent = ""; });
}
function showError(message = "", target = "coverError") { $(target).textContent = message; }

$("interfaceLanguage").addEventListener("change", async () => { applyInterfaceLanguage($("interfaceLanguage").value); await chrome.storage.local.set({ interfaceLanguage: state.interfaceLanguage }); });
$("language").addEventListener("change", async () => { await chrome.storage.local.set({ language: $("language").value }); });
$("resumeList").addEventListener("click", async (event) => {
  const control = event.target.closest("[data-action]");
  if (!control) return;
  const resumeId = control.dataset.resumeId;
  if (!resumeId) return;

  if (control.dataset.action === "select-resume") {
    state.activeResumeId = resumeId;
    syncActiveResume();
    renderResumeSelector();
    await chrome.storage.local.set({ activeResumeId: state.activeResumeId });
    return;
  }

  if (control.dataset.action === "delete-resume") {
    event.stopPropagation();
    state.resumes = state.resumes.filter((resume) => resume.id !== resumeId);
    if (state.activeResumeId === resumeId) state.activeResumeId = state.resumes[0]?.id || "";
    syncActiveResume();
    renderResumeSelector();
    await chrome.storage.local.set({ resumes: state.resumes, activeResumeId: state.activeResumeId });
  }
});

$("resumeList").addEventListener("change", async (event) => {
  if (event.target.matches('input[type="radio"][name="activeResume"]')) {
    state.activeResumeId = event.target.value;
    syncActiveResume();
    renderResumeSelector();
    await chrome.storage.local.set({ activeResumeId: state.activeResumeId });
  }
});
$("requirementPreset").addEventListener("change", async () => { const preset = $("requirementPreset").value; if (preset !== "custom") $("coverLetterRequirements").value = REQUIREMENT_PRESETS[preset]; updateCoverRequirementsSummary(); await chrome.storage.local.set({ requirementPreset: preset, coverLetterRequirements: $("coverLetterRequirements").value }); });
$("coverLetterRequirements").addEventListener("input", async () => { const requirements = $("coverLetterRequirements").value; const selectedPreset = $("requirementPreset").value; if (selectedPreset !== "custom" && requirements !== REQUIREMENT_PRESETS[selectedPreset]) $("requirementPreset").value = "custom"; updateCoverRequirementsSummary(); await chrome.storage.local.set({ requirementPreset: $("requirementPreset").value, coverLetterRequirements: requirements }); });
$("toggleApiKey").addEventListener("click", () => { const input = $("apiKey"); input.type = input.type === "text" ? "password" : "text"; $("toggleApiKey").textContent = input.type === "text" ? t("hide") : t("show"); });
$("saveApiKey").addEventListener("click", async () => { clearFeedback("apiError"); const apiKey = $("apiKey").value.trim(); if (!apiKey) return showError(t("enterApiKey"), "apiError"); if (!apiKey.startsWith("sk-")) return showError(t("invalidApiKey"), "apiError"); await chrome.storage.local.set({ apiKey }); $("apiKeyStatus").textContent = t("savedLocally"); });
$("clearApiKey").addEventListener("click", async () => { await chrome.storage.local.remove("apiKey"); $("apiKey").value = ""; $("apiKey").type = "password"; $("toggleApiKey").textContent = t("show"); $("apiKeyStatus").textContent = t("notSaved"); clearFeedback("apiError"); });

async function fingerprintFile(file) {
  const bytes = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

$("uploadResume").addEventListener("click", async () => {
  clearFeedback("resumeError");
  const files = Array.from($("resume").files || []);
  if (!files.length) return showError(t("selectResume"), "resumeError");
  const button = $("uploadResume"); setBusy(button, true, "parsing", "addResumes");
  try {
    let cacheHits = 0;
    for (const file of files) {
      const fingerprint = await fingerprintFile(file);
      const cached = state.resumes.find((resume) => resume.fingerprint === fingerprint && resume.text);
      if (cached) {
        state.activeResumeId = cached.id;
        cacheHits += 1;
        continue;
      }

      const formData = new FormData(); formData.append("resume", file);
      const response = await fetch(`${API_BASE}/api/parse-resume`, { method: "POST", body: formData });
      const data = await response.json(); if (!response.ok) throw new Error(`${file.name}: ${data.error || t("resumeParseFailed")}`);
      const existing = state.resumes.find((resume) => resume.name === file.name);
      const entry = {
        id: existing?.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        text: data.text,
        characters: data.characters,
        fingerprint,
        fileSize: file.size,
        fileType: file.type || ""
      };
      state.resumes = [...state.resumes.filter((resume) => resume.id !== entry.id), entry];
      state.activeResumeId = entry.id;
    }
    syncActiveResume(); renderResumeSelector(); $("resume").value = "";
    if (cacheHits) $("resumeStatus").textContent = `${t("cacheHit")} · ${cacheHits}`;
    await chrome.storage.local.set({ resumes: state.resumes, activeResumeId: state.activeResumeId });
  } catch (error) { showError(`${error.message}. ${t("serviceCheck")}`, "resumeError"); }
  finally { setBusy(button, false, "parsing", "addResumes"); }
});

async function readCurrentPageJobDescription() {
  clearFeedback("jobError");
  const button = $("readJobDescription");
  const status = $("jobDescriptionStatus");
  setBusy(button, true, "readingPage", "readCurrentPage");
  status.textContent = "";
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !/^https?:/i.test(tab.url || "")) throw new Error(t("restrictedPage"));
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const selectors = [
          '[data-testid*="job-description" i]', '[class*="job-description" i]', '[id*="job-description" i]',
          '[class*="jobDescription" i]', '[id*="jobDescription" i]', 'article', 'main'
        ];
        const candidates = [];
        for (const selector of selectors) {
          for (const node of document.querySelectorAll(selector)) {
            const text = (node.innerText || "").replace(/\n{3,}/g, "\n\n").trim();
            if (text.length >= 200) candidates.push(text);
          }
        }
        const bodyText = (document.body?.innerText || "").replace(/\n{3,}/g, "\n\n").trim();
        if (bodyText.length >= 200) candidates.push(bodyText);
        candidates.sort((a, b) => {
          const score = (text) => {
            const lower = text.toLowerCase();
            const keywords = ['responsibilities', 'requirements', 'qualifications', 'about the role', 'job description', 'what you will do', '职位', '职责', '要求', '任职资格'];
            return keywords.reduce((total, keyword) => total + (lower.includes(keyword) ? 500 : 0), 0) - Math.abs(text.length - 7000) / 20;
          };
          return score(b) - score(a);
        });
        return { text: candidates[0] || "", title: document.title, url: location.href };
      }
    });
    const text = result?.text?.trim() || "";
    if (text.length < 100) throw new Error(t("pageReadFailed"));
    $("jobDescription").value = text.slice(0, 30000);
    state.pageTitle = result.title || tab.title || "";
    state.pageUrl = result.url || tab.url || "";
    await chrome.storage.local.set({ jobDescription: $("jobDescription").value });
    status.textContent = `${t("pageReadSuccess")} · ${$("jobDescription").value.length.toLocaleString()} ${t("characters")}`;
  } catch (error) {
    showError(error.message || t("pageReadFailed"), "jobError");
  } finally {
    setBusy(button, false, "readingPage", "readCurrentPage");
  }
}

$("readJobDescription").addEventListener("click", readCurrentPageJobDescription);
$("jobDescription").addEventListener("input", async () => {
  $("jobDescriptionStatus").textContent = "";
  await chrome.storage.local.set({ jobDescription: $("jobDescription").value });
});

$("generate").addEventListener("click", async () => {
  clearFeedback("coverError"); const apiKey = $("apiKey").value.trim(); const jobDescription = $("jobDescription").value.trim(); if (!apiKey) return showError(t("apiKeyFirst"), "coverError"); if (!state.resumeText) return showError(t("resumeFirst"), "coverError"); if (jobDescription.length < 100) return showError(t("jobTooShort"), "coverError");
  const options = { tone: $("tone").value, length: $("length").value, language: $("language").value, requirementPreset: $("requirementPreset").value, coverLetterRequirements: $("coverLetterRequirements").value.trim() }; await chrome.storage.local.set({ jobDescription, ...options });
  const button = $("generate"); setBusy(button, true, "generating", "generate");
  try { const response = await fetch(`${API_BASE}/api/generate-cover-letter`, { method: "POST", headers: { "Content-Type": "application/json", "X-OpenAI-API-Key": apiKey }, body: JSON.stringify({ resumeText: state.resumeText, jobDescription, pageTitle: state.pageTitle, pageUrl: state.pageUrl, ...options }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || t("generationFailed")); $("result").value = data.coverLetter; }
  catch (error) { showError(`${error.message}. ${t("checkServiceKey")}`, "coverError"); }
  finally { setBusy(button, false, "generating", "generate"); }
});

$("applicationQuestion").addEventListener("input", async () => { await chrome.storage.local.set({ applicationQuestion: $("applicationQuestion").value }); });
$("answerRequirements").addEventListener("input", async () => { await chrome.storage.local.set({ answerRequirements: $("answerRequirements").value }); });
["answerTone", "answerWordLimit", "answerStyle"].forEach((id) => $(id).addEventListener("change", async () => { await chrome.storage.local.set({ [id]: $(id).value }); }));

$("generateAnswer").addEventListener("click", async () => {
  clearFeedback("answerError");
  const apiKey = $("apiKey").value.trim();
  const question = $("applicationQuestion").value.trim();
  const jobDescription = $("jobDescription").value.trim();
  const answerRequirements = $("answerRequirements").value.trim();
  const answerTone = $("answerTone").value;
  const answerWordLimit = $("answerWordLimit").value;
  const answerStyle = $("answerStyle").value;
  if (!apiKey) return showError(t("apiKeyFirst"), "answerError");
  if (!state.resumeText) return showError(t("resumeFirst"), "answerError");
  if (!question) return showError(t("questionRequired"), "answerError");
  await chrome.storage.local.set({ applicationQuestion: question, answerRequirements, jobDescription, answerTone, answerWordLimit, answerStyle });
  const button = $("generateAnswer");
  setBusy(button, true, "generatingAnswer", "generateAnswer");
  try {
    const response = await fetch(`${API_BASE}/api/generate-application-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-OpenAI-API-Key": apiKey },
      body: JSON.stringify({
        resumeText: state.resumeText,
        jobDescription,
        pageTitle: state.pageTitle,
        pageUrl: state.pageUrl,
        question,
        answerRequirements: [answerRequirements, `Tone: ${answerTone}.`, answerWordLimit !== "none" ? `Maximum ${answerWordLimit} words.` : "", `Answer type: ${answerStyle}.`].filter(Boolean).join(" "),
        language: $("language").value,
        tone: answerTone
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || t("answerGenerationFailed"));
    $("applicationAnswer").value = data.answer;
    await chrome.storage.local.set({ applicationAnswer: data.answer });
  } catch (error) {
    showError(`${error.message}. ${t("checkServiceKey")}`, "answerError");
  } finally {
    setBusy(button, false, "generatingAnswer", "generateAnswer");
  }
});

$("copyAnswer").addEventListener("click", async () => {
  const text = $("applicationAnswer").value;
  if (!text) return;
  await navigator.clipboard.writeText(text);
  const button = $("copyAnswer");
  button.textContent = t("copied");
  setTimeout(() => { button.textContent = t("copy"); }, 1200);
});

$("saveResult").addEventListener("click", async () => { clearFeedback("saveError"); const text = $("result").value.trim(); if (!text) return showError(t("nothingToSave"), "saveError"); const format = $("saveFormat").value; const button = $("saveResult"); setBusy(button, true, "saving", "save"); try { if (format === "docx") await saveAsDocx(text); else await saveAsPdf(text); } catch (error) { showError(`${error.message}. ${t("serviceCheck")}`, "saveError"); } finally { setBusy(button, false, "saving", "save"); } });

restoreState().catch((error) => showError(error.message, "coverError"));
