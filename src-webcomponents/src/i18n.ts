/** The words the element shows, in the languages of ioBroker */
const EN = {
    chooseInstance: 'Choose an instance in the settings',
    notType: 'Not a trash type of Trash Schedule',
    noData: 'No data - is the instance running?',
    noPickups: 'No upcoming pickups',
    daysLeft: 'Days left',
    // the trash types of the sample the editor shows while there is no data
    paper: 'Paper',
    organic: 'Organic waste',
    recycling: 'Recycling',
    residual: 'Residual waste',
};

export type WordKey = keyof typeof EN;

const WORDS: Record<string, Record<WordKey, string>> = {
    en: EN,
    de: {
        chooseInstance: 'Instanz in den Einstellungen wählen',
        notType: 'Kein Abfall-Typ von Trash Schedule',
        noData: 'Keine Daten - läuft die Instanz?',
        noPickups: 'Keine anstehenden Abholungen',
        daysLeft: 'Verbleibende Tage',
        paper: 'Papier',
        organic: 'Biomüll',
        recycling: 'Wertstoffe',
        residual: 'Restmüll',
    },
    ru: {
        chooseInstance: 'Выберите экземпляр в настройках',
        notType: 'Это не тип мусора Trash Schedule',
        noData: 'Нет данных - экземпляр запущен?',
        noPickups: 'Нет предстоящих вывозов',
        daysLeft: 'Осталось дней',
        paper: 'Бумага',
        organic: 'Органические отходы',
        recycling: 'Вторсырьё',
        residual: 'Смешанные отходы',
    },
    pt: {
        chooseInstance: 'Escolha uma instância nas configurações',
        notType: 'Não é um tipo de lixo do Trash Schedule',
        noData: 'Sem dados - a instância está em execução?',
        noPickups: 'Nenhuma recolha prevista',
        daysLeft: 'Dias restantes',
        paper: 'Papel',
        organic: 'Orgânicos',
        recycling: 'Recicláveis',
        residual: 'Indiferenciados',
    },
    nl: {
        chooseInstance: 'Kies een instantie in de instellingen',
        notType: 'Geen soort afval van Trash Schedule',
        noData: 'Geen gegevens - draait de instantie?',
        noPickups: 'Geen komende ophalingen',
        daysLeft: 'Resterende dagen',
        paper: 'Papier',
        organic: 'Gft',
        recycling: 'Plastic',
        residual: 'Restafval',
    },
    fr: {
        chooseInstance: 'Choisissez une instance dans les paramètres',
        notType: 'Pas un type de déchets de Trash Schedule',
        noData: "Aucune donnée - l'instance est-elle démarrée ?",
        noPickups: 'Aucune collecte à venir',
        daysLeft: 'Jours restants',
        paper: 'Papier',
        organic: 'Biodéchets',
        recycling: 'Recyclables',
        residual: 'Ordures ménagères',
    },
    it: {
        chooseInstance: "Scegli un'istanza nelle impostazioni",
        notType: 'Non è un tipo di rifiuti di Trash Schedule',
        noData: "Nessun dato - l'istanza è in esecuzione?",
        noPickups: 'Nessuna raccolta in arrivo',
        daysLeft: 'Giorni rimanenti',
        paper: 'Carta',
        organic: 'Organico',
        recycling: 'Plastica',
        residual: 'Indifferenziata',
    },
    es: {
        chooseInstance: 'Elija una instancia en la configuración',
        notType: 'No es un tipo de basura de Trash Schedule',
        noData: 'Sin datos: ¿se está ejecutando la instancia?',
        noPickups: 'No hay recogidas próximas',
        daysLeft: 'Días restantes',
        paper: 'Papel',
        organic: 'Orgánico',
        recycling: 'Envases',
        residual: 'Resto',
    },
    pl: {
        chooseInstance: 'Wybierz instancję w ustawieniach',
        notType: 'To nie jest rodzaj śmieci Trash Schedule',
        noData: 'Brak danych - czy instancja działa?',
        noPickups: 'Brak nadchodzących wywozów',
        daysLeft: 'Pozostało dni',
        paper: 'Papier',
        organic: 'Bio',
        recycling: 'Tworzywa',
        residual: 'Zmieszane',
    },
    uk: {
        chooseInstance: 'Виберіть екземпляр у налаштуваннях',
        notType: 'Це не тип сміття Trash Schedule',
        noData: 'Немає даних - екземпляр запущено?',
        noPickups: 'Немає запланованих вивозів',
        daysLeft: 'Залишилось днів',
        paper: 'Папір',
        organic: 'Органічні відходи',
        recycling: 'Вторсировина',
        residual: 'Змішані відходи',
    },
    'zh-cn': {
        chooseInstance: '请在设置中选择实例',
        notType: '不是 Trash Schedule 的垃圾类型',
        noData: '无数据 - 实例是否在运行？',
        noPickups: '没有即将到来的清运',
        daysLeft: '剩余天数',
        paper: '纸张',
        organic: '厨余垃圾',
        recycling: '可回收物',
        residual: '其他垃圾',
    },
};

/**
 * A word in the language of the system, English if there is none in it
 *
 * @param lang the language of the ioBroker system
 * @param key the word
 */
export function getWord(lang: string, key: WordKey): string {
    return WORDS[lang]?.[key] || EN[key];
}
