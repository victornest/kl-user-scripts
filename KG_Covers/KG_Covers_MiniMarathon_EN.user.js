// ==UserScript==
// @name           KG_Covers_MiniMarathon_EN
// @version        0.2.6
// @namespace      klavogonki
// @author         vnest
// @description    Скрипт добавляет обложки для текстов из словаря "Мини-марафон in English"
// @include        http*://klavogonki.ru/g/*
// @grant          none
// ==/UserScript==

(async function () {
    'use strict';

    ///////////////////////////////////////////////////////////////////////////////
    // Настройки
    ///////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////
    // Конец настроек
    ///////////////////////////////////////////////////////////////////////////////

    const localStorageName = "KG_Covers.MiniMarathon.EN";

    // словарь обложек, ключ - первые 200 символов текста.

    const coversMap = {
        "I was a birch tree, white slenderness in the middle of a meadow, but had no name for what I was. My leaves drank of the sunlight that streamed through them and set their green aglow, my leaves danced ": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "The need for the comfort it would give surprised her. She, the holothete, to whom everything visible was merely a veil that reality wore. The past eight Earth-years must have drunk deeper of her than ": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "In a split pulsebeat, she calculated how to bring Faraday onto her viewscreen. There was no particular reason for that. She knew what the watchcraft looked like: a tapered gray cylinder so as to be ca": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "Though what would they make of her, perhaps in more than one meaning of the phrase? Even physical appearance might conceivably not be altogether irrelevant to them. It was an odd thing to do in these ": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "Joelle shook herself. Stop. Be sensible. I'm obsessive about the Others, I know. Seeing their handiwork again serving not aliens but humans must have uncapped a wellspring in me. But Willem's right. T": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "The connection was not through wires stuck in her skull; electromagnetic induction sufficed. She, in turn, called on the powerful computer to which she was also linked, as problems arose moment by mom": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "She magnified and the shape grew clear, though the dimensions remained an abstraction: length about a thousand kilometers, diameter slightly more than two. It spun around its long axis so fast that a ": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "I was a caterpillar that crawled, a pupa that slumbered, a moth that flew in search of the Moon. The changes were so deep that my body could not remember what it had formerly been. Nor had I the means": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "My food was the nectar of flowers, taken as I hovered on fluttery wingbeats, though sometimes the fermented sap of a tree set me and a thousand like me dizzily spiraling about. Wilder was it to strive": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "Yet it was a failure. Men had constructed it a century ago, to serve as a base for operations among the asteroids. Thinly scattered though those remnants of a stillborn world are, they could profitabl": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "The drought had lasted now for ten million years, and the reign of the terrible lizards had long since ended. Here on the Equator, in the continent which would one day be known as Africa, the battle f": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "He was nearly five feet high, and though badly undernourished weighed over a hundred pounds. His hairy, muscular body was halfway between ape and man, but his head was already much nearer to man than ": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "Moon-Watcher barely stirred when the screams echoed up the slope from one of the lower caves, and he did not need to hear the occasional growl of the leopard to know exactly what was happening. Down t": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "He had almost forgotten the terrors of the night, because nothing had happened after that initial noise, so he did not even associate this strange thing with danger or with fear. There was, after all,": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "First it lost its transparency, and became suffused with luminescence. Tantalizing, ill-defined phantoms moved across its surface and in its depths. They coalesced into bars of light and shadow, then ": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "He did not move from his position, but his body lost its trancelike rigidity and became animated as if it were a puppet controlled by invisible strings. The head turned this way and that; the mouth si": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "He searched around until he had found another pebble. This time it hit the slab with a ringing, bell-like tone. He was still a long way off, but his aim was improving. At the fourth attempt, he was on": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "He was looking at a peaceful family group. The male, female, and two infants that had mysteriously appeared before him were gorged and replete, with sleek and glossy pelts – and this was a condition o": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "It was a slow business, but the crystal monolith was patient. Neither it, nor its replicas scattered across half the globe, expected to succeed with all the scores of groups involved. A hundred failur": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "If he had known how difficult the task would be, he would never have attempted it. Only his great strength, and the agility inherited from his arboreal ancestors allowed him to haul the carcass up the": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "What he saw left him so paralyzed with fright that for long seconds he was unable to move. Only twenty feet below, two eyes were staring straight up at him; they held him so hypnotized with fear that ": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "It whirled around, throwing its daring tormentor against the wall of the cave. Yet whatever it did, it could not escape the rain of blows, inflicted on it by crude weapons wielded by clumsy but powerf": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "It was still so rare that a hasty census might have overlooked it, among the teeming billions of creatures roving over land and sea. There was no evidence, as yet, that it would prosper or even surviv": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "Their teeth were growing smaller, for they were no longer essential. The sharp-edged stones that could be used to dig out roots, or to cut and saw through tough flesh or fiber, had begun to replace th": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "And somewhere in the shadowy centuries that had gone before they had invented the most essential tool of all, though it could be neither seen nor touched. They had learned to speak, and so had won the": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "Floyd felt himself well charged with oxygen, and ready to tackle anything, when the launching track began to sling its thousand-ton payload out over the Atlantic. It was hard to tell when they lifted ": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "It seemed that the ship was standing on its tail. To Floyd, who was at the very front of the cabin, all the seats appeared to be fixed on a wall topping vertically beneath him. He was doing his best t": {
            "author": "Arthur C. Clarke",
            "title": "2001: A Space Odyssey",
            "cover": "https://i.imgur.com/3j1WzNj.jpg?1"
        },
        "As much mud in the streets as if the waters had but newly retired from the face of the earth, and it would not be wonderful to meet a Megalosaurus, forty feet long or so, waddling like an elephantine ": {
            "author": "Charles Dickens",
            "title": "Bleak House",
            "cover": "https://i.imgur.com/WffN7eg.png?1"
        },
        "Fog everywhere. Fog up the river, where it flows among green aits and meadows; fog down the river, where it rolls deified among the tiers of shipping and the waterside pollutions of a great (and dirty": {
            "author": "Charles Dickens",
            "title": "Bleak House",
            "cover": "https://i.imgur.com/WffN7eg.png?1"
        },
        "Sir Leicester had so much family that perhaps he had enough and could dispense with any more. But she had beauty, pride, ambition, resolve, and sense enough to portion out a legion of fine ladies. Wea": {
            "author": "Charles Dickens",
            "title": "Bleak House",
            "cover": "https://i.imgur.com/WffN7eg.png?1"
        },
        "As for sweets, I won't tell you how cheap and good they were, because it would only make your mouth water in vain. And in those days there lived in London a girl called Polly Plummer. She lived in one": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "As he rose to his feet he noticed that he was neither dripping nor panting for breath as anyone would expect after being under water. His clothes were perfectly dry. He was standing by the edge of a s": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "They had many great windows in them, windows without glass, through which you saw nothing but black darkness. Lower down there were great pillared arches, yawning blackly like the mouths of railway tu": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "Before a minute had passed it was twice as loud as it had been to begin with. It was soon so loud that if the children had tried to speak (but they weren't thinking of speaking now – they were just st": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "They were facing one another across the pillar where the bell hung, still trembling, though it no longer gave out any note. Suddenly they heard a soft noise from the end of the room which was still un": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "He wondered about this a good deal as the first slow half-hour ticked on. But you need not wonder, for I am going to tell you. She had got home late for her dinner, with her shoes and stockings very w": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "Something was happening at last. A voice had begun to sing. It was very far away and Digory found it hard to decide from what direction it was coming. Sometimes it seemed to come from all directions a": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "Then two wonders happened at the same moment. One was that the voice was suddenly joined by other voices; more voices than you could possibly count. They were in harmony with it, but far higher up the": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "There was soon light enough for them to see one another's faces. The Cabby and the two children had open mouths and shining eyes; they were drinking in the sound, and they looked as if it reminded the": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "The eastern sky changed from white to pink and from pink to gold. The Voice rose and rose, till all the air was shaking with it. And just as it swelled to the mightiest and most glorious sound it had ": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "It was softer and more lilting than the song by which he had called up the stars and the sun. And as he walked and sang the valley grew green with grass. It spread out from the Lion like a pool. It ra": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "Can you imagine a stretch of grassy land bubbling like water in a pot? For that is really the best description of what was happening. In all directions it was swelling into humps. They were of very di": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "Fledge came lower and lower in wide circles. The icy peaks rose up higher and higher above. The air came up warmer and sweeter every moment, so sweet that it almost brought the tears to your eyes. Fle": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "When things go wrong, you'll find they usually go on getting worse for some time; but when things once start going right they often go on getting better and better. After about six weeks of this lovel": {
            "author": "C.S. Lewis",
            "title": "The Magician's Nephew",
            "cover": "https://i.imgur.com/tWwvbGz.png?1"
        },
        "When he had passed they looked up. While the first light of the fire had shot east and west, painting the sides of ships with fire-light or striking red sparks out of windowed houses, it had not hithe": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "The flying ship of Professor Lucifer sang through the skies like a silver arrow; the bleak white steel of it, gleaming in the bleak blue emptiness of the evening. That it was far above the earth was n": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "A plain of sad-coloured cloud lay along the level of the top of the Cathedral dome, so that the ball and the cross looked like a buoy riding on a leaden sea. As the flying ship swept towards it, this ": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "Father Michael in spite of his years, and in spite of his asceticism (or because of it, for all I know), was a very healthy and happy old gentleman. And as he swung on a bar above the sickening emptin": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "He felt with a sort of half-witted lucidity that the cross was there, and the ball was there, and the dome was there, that he was going to climb down from them, and that he did not mind in the least w": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "Michael felt he knew not how. The whole peace of the world was pent up painfully in his heart. The new and childlike world which he had seen so suddenly, men had not seen at all. Here they were still ": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "On that fantastic fringe of the Gaelic land where he walked as a boy, the cliffs were as fantastic as the clouds. The paths of his little village began to climb quite suddenly and seemed resolved to g": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "The police magistrate, before whom they were hurried and tried, was a Mr. Cumberland Vane, a cheerful, middle-aged gentleman, honourably celebrated for the lightness of his sentences and the lightness": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "The duellists had from their own point of view escaped or conquered the chief powers of the modern world. They had satisfied the magistrate, they had tied the tradesman neck and heels, and they had le": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "They were sitting in a sort of litter on the hillside; all the things they had hurriedly collected, in various places, for their flight, were strewn indiscriminately round them. The two swords with wh": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "The voice was too polite for good manners. It was incongruous with the eccentric spectacle of the duellists which ought to have startled a sane and free man. It was also incongruous with the full and ": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "Legends of the morning of the world which he had heard in childhood or read in youth came back upon him in a cloudy splendour, purple tales of wrath and friendship, reminding him of emotional entangle": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "Almost as he did so the ferrule of an ordinary bamboo cane came at his eyes, so that he had actually to parry it with the naked weapon in his hands. As the two touched, the point of the stick was drop": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "They had to run over a curve of country that looked smooth but was very rough; a neglected field which they soon found to be full of the tallest grasses and the deepest rabbit-holes. Moreover, that gr": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "The car shot on up and down the shining moonlit lanes, and there was no sound in it except the occasional click or catch of its machinery; for through some cause or other no soul inside it could think": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "Heaven itself had opened around him and given him an hour of its own ancient energy. He had never felt so much alive before; and yet he was like a man in a trance. And if you had asked him on what his": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "Nor did MacIan sit down; he stood up stunned and yet staring, as he would have stood up at the trumpet of the Last Day. A black dot in the distance sprang up a tall black forest, swallowed them and sp": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "The cool voice of his companion cut in upon his monologue, calling to him from a little farther along the cliff, to tell him that he had found the ladder of descent. It began as a steep and somewhat g": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "He tried to concentrate his senses on the sword-play; but one half of his brain was wrestling with the puzzle; the apocalyptic and almost seraphic apparition of a stout constable on top of a dreary an": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "The two had a long race for the harbour; but the English police were heavy and the French inhabitants were indifferent. In any case, they got used to the notion of the road being clear; and just as th": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "Down the centre of the central garden path, preceded by a blue cloud from a cigarette, was walking a gentleman who evidently understood all the relish of a garden in the very early morning. He was a s": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "The advancing figure walked with a stoop, and yet somehow flung his forked and narrow beard forward. That carefully cut and pointed yellow beard was, indeed, the most emphatic thing about him. When he": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "Plain and positive as he was, the influence of earth and sky may have been greater on him than he imagined; and the weather that walked the world at that moment was as red and angry as Turnbull. Long ": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "While our friend stood frozen for an instant by his astonishment, the queer figure in the airy car tipped the vehicle almost upside down by leaping over the side of it, seemed to slide or drop down th": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "He drew a little nearer to the wall and, catching the man at a slightly different angle of the evening light, could see his face and figure quite plain. Two facts about him stood out in the picked col": {
            "author": "G. K. Chesterton",
            "title": "The Ball and the Cross",
            "cover": "https://i.imgur.com/KAOHgb7.png?1"
        },
        "Before that, like every beginner, I thought you could beat, pummel, and thrash an idea into existence. Under such treatment, of course, any decent idea folds up its paws, turns on its back, fixes its ": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "I began to try words for all that. What you have here in this book then is a gathering of dandelions from all those years. The wine metaphor which appears again and again in these pages is wonderfully": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "A whole summer ahead to cross off the calendar, day by day. Like the goddess Siva in the travel books, he saw his hands jump everywhere, pluck sour apples, peaches, and midnight plums. He would be clo": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "A single invisible line on the air touched his brow and snapped without a sound. So, with the subtlest of incidents, he knew that this day was going to be different. It would be different also, becaus": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "The wine was summer caught and stoppered. And now that Douglas knew, he really knew he was alive, and moved turning through the world to touch and see it all, it was only right and proper that some of": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "They passed like cloud shadows downhill... the boys of summer, running. Douglas, left behind, was lost. Panting, he stopped by the rim of the ravine, at the edge of the softly blowing abyss. Here, ear": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "Matches being struck, the first dishes bubbling in the suds and tinkling on the wall racks, somewhere, faintly, a phonograph playing. And then as the evening changed the hour, at house after house on ": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "What they talked of all evening long, no one remembered next day. It wasn't important to anyone what the adults talked about; it was only important that the sounds came and went over the delicate fern": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "Once each year he woke this way and lay waiting for the sound which meant that summer had officially begun. And it began on a morning such as this when a boarder, a nephew, a cousin, a son or a grands": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "The first light on the roof outside; very early morning. The leaves on all the trees tremble with a soft awakening to any breeze the dawn may offer. And then, far off, around a curve of silver track, ": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "They sat eating ham sandwiches and fresh strawberries and waxy oranges and Mr. Tridden told them how it had been twenty years ago, the band playing on that ornate stand at night, the men pumping air i": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "The facts about John Huff aged twelve are simple and soon stated. He could pathfind more trails than any Cherokee since time began, could leap from the sky like a chimpanzee from a vine, could live un": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "It was the face of spring, it was the face of summer, it was the warmness of clover breath. Pomegranate glowed in her lips, and the noon sky in her eyes. To touch her face was that always new experien": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "The three women moved along the street under the black trees, past suddenly locked houses. How soon the news had spread outward from the ravine, from house to house, porch to porch, telephone to telep": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "She was a woman with a broom or a dustpan or a washrag or a mixing spoon in her hand. You saw her cutting piecrust in the morning, humming to it, or you saw her setting out the baked pies at noon or t": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "There she sat in her glass coffin, night after night, her body melted by the carnival blaze of summer, frozen in the ghost winds of winter, waiting with her sickle smile and carved, hooked, and wax-po": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "Douglas had cried out. For years he had seen billions of cowboys shot, hung, burned, destroyed. But now, this one particular man... He'll never walk, run, sit, laugh, cry, won't do anything ever, thou": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "Now Douglas knew why the arcade had drawn him so steadily this week and drew him still tonight. For there was a world completely set in place, predictable, certain, sure, with its bright silver slots,": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "The sidewalks were haunted by dust ghosts all night as the furnace wind summoned them up, swung them about, and gentled them down in a warm spice on the lawns. Trees, shaken by the footsteps of late-n": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "Perhaps it was an hour before the moon spilled all its light upon the world, perhaps less. But the voice was nearer now and a sound like the beating of a heart which was really the motion of a horse's": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "A great uproar ensued, a clashing of plates, a swarming of arms, a rush of voices which hoped to drown blasphemous inquiry forever, Douglas talking louder and making more motions than the rest. But in": {
            "author": "Ray Bradbury",
            "title": "Dandelion Wine",
            "cover": "https://i.imgur.com/1sen0z8.png?1"
        },
        "It was a special pleasure to see things eaten, to see things blackened and changed. With the brass nozzle in his fists, with this great python spitting its venomous kerosene upon the world, the blood ": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "He turned the corner. The autumn leaves blew over the moonlit pavement in such a way as to make the girl who was moving there seem fixed to a sliding walk, letting the motion of the wind and the leave": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "His wife stretched on the bed, uncovered and cold, like a body displayed on the lid of a tomb, her eyes fixed to the ceiling by invisible threads of steel. And in her ears the little Seashells, the th": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "The object he had sent tumbling with his foot now glinted under the edge of his own bed. The small crystal bottle of sleeping-tablets which earlier today had been filled with thirty capsules and which": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "They had two machines, really. One of them slid down into your stomach like a black cobra down an echoing well looking for all the old water and the old time gathered there. It drank up the green matt": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "This woman was spoiling the ritual. The men were making too much noise, laughing, joking to cover her terrible accusing silence below. She made the empty rooms roar with accusation and shake down a fi": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "He stumbled towards the bed and shoved the book clumsily under the cold pillow. He fell into bed and his wife cried out, startled. He lay far across the room from her, on a winter island separated by ": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "Then Montag talked about the weather, and then the old man responded with a pale voice. It was a strange quiet meeting. The old man admitted to being a retired English professor who had been thrown ou": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "Montag said nothing but stood looking at the women's faces as he had once looked at the faces of saints in a strange church he had entered when he was a child. The faces of those enamelled creatures m": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "A great nuzzling gout of flame leapt out to lap at the books and knock them against the wall. He stepped into the bedroom and fired twice and the twin beds went up in a great simmering whisper, with m": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "If we have to burn, let's take a few more with us. Here! He remembered the books and turned back. Just on the off chance. He found a few books where he had left them, near the garden fence. Mildred, G": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "There was nowhere to go, no friend to turn to. Except Faber. And then he realized that he was indeed, running toward Faber's house, instinctively. But Faber couldn't hide him; it would be suicide even": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "He washed his hands and face and towelled himself dry, making little sound. He came out of the washroom and shut the door carefully and walked into the darkness and at last stood again on the edge of ": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "He was three hundred yards downstream when the Hound reached the river. A storm of light fell upon the river and Montag dived under the great illumination as if the sun had broken the clouds. He felt ": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "It burned Time. The world rushed in a circle and turned on its axis and time was busy burning the years and the people anyway, without any help from him. So if he burnt things with the firemen, and th": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "He would lie back and look out of the loft window, and see the lights go out in the farmhouse itself, until a very young and beautiful woman would sit in an unlit window, braiding her hair. It would b": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "A deer. He smelled the heavy musk-like perfume mingled with blood and the gummed exhalation of the animal's breath, all cardamon and moss and ragweed odour in this huge night where the trees ran at hi": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "And he was surprised to learn how certain he suddenly was of a single fact he could not prove. Once, long ago, Clarisse had walked here. Half an hour later, cold, and moving carefully on the tracks, f": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "There was a foolish and yet delicious sense of knowing himself as an animal come from the forest, drawn by the fire. He was a thing of brush and liquid eye, of fur and muzzle and hoof, he was a thing ": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "He was looking for a brightness, a resolve, a triumph over tomorrow that hardly seemed to be there. Perhaps he had expected their faces to burn and glitter with the knowledge they carried, to glow as ": {
            "author": "Ray Bradbury",
            "title": "Fahrenheit 451",
            "cover": "https://i.imgur.com/iAnXsL9.png?1"
        },
        "He glanced around at his friend reading the letter and saw the books on the table. Into his eyes leaped a wistfulness and a yearning as promptly as the yearning leaps into the eyes of a starving man a": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "And then he turned and saw the girl. The phantasmagoria of his brain vanished at sight of her. She was a pale, ethereal creature, with wide, spiritual blue eyes and a wealth of golden hair. He did not": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "And she began to talk quickly and easily upon the subject he had suggested. He felt better, and settled back slightly from the edge of the chair, holding tightly to its arms with his hands, as if it m": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "He stared at her with hungry eyes. Here was something to live for, to win to, to fight for - ay, and die for. There were such women in the world. She was one of them. She lent wings to his imagination": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "Again she felt drawn to him. She was surprised by a wanton thought that rushed into her mind. It seemed to her that if she could lay her two hands upon that neck that all its strength and vigor would ": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "The process of getting into the dining room was a nightmare to him. Between halts and stumbles, jerks and lurches, locomotion had at times seemed impossible. But at last he had made it, and was seated": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "He glanced around the table. Opposite him was Arthur, and Arthur's brother, Norman. They were her brothers, he reminded himself, and his heart warmed toward them. How they loved each other, the member": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "He did not know that his quietness was giving the lie to Arthur's words of the day before, when that brother of hers had announced that he was going to bring a wild man home to dinner and for them not": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "He paused, open-mouthed, on the verge of the pit of his own depravity and utter worthlessness to breathe the same air she did. And while Arthur took up the tale, for the twentieth time, of his adventu": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "And while he talked, the girl looked at him with startled eyes. His fire warmed her. She wondered if she had been cold all her days. She wanted to lean toward this burning, blazing man that was like a": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "Later, at the piano, she played for him, and at him, with the vague intent of emphasizing the impassableness of the gulf that separated them. Her music was a club that she swung brutally upon his head": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "It was a transfigured face, with great shining eyes that gazed beyond the veil of sound and saw behind it the leap and pulse of life and the gigantic phantoms of the spirit. She was startled. The raw,": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "He caught a Telegraph Avenue car that was going to Berkeley. It was crowded with youths and young men who were singing songs and ever and again barking out college yells. He studied them curiously. Th": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "He wondered if there was soul in those steel-gray eyes that were often quite blue of color and that were strong with the briny airs of the sun-washed deep. He wondered, also, how his eyes looked to he": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "He sat back on the bed with a bitter laugh, and finished taking off his shoes. He was a fool; he had been made drunken by a woman's face and by a woman's soft, white hands. And then, suddenly, before ": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "Martin went into the kitchen with a sinking heart, the image of her red face and slatternly form eating its way like acid into his brain. She might love him if she only had some time, he concluded. Bu": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "There had been times when it was all he could do to refrain from reaching over and mopping Jim's face in the mush-plate. The more he had chattered, the more remote had Ruth seemed to him. How could he": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "He dared not go near Ruth's neighborhood in the daytime, but night found him lurking like a thief around the Morse home, stealing glimpses at the windows and loving the very walls that sheltered her. ": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "But the reform went deeper. He still smoked, but he drank no more. Up to that time, drinking had seemed to him the proper thing for men to do, and he had prided himself on his strong head which enable": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "There were always numbers of men who stood on the sidewalk outside, and he could pull his cap down over his eyes and screen himself behind some one's shoulder so that she should not see him. He emerge": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "It was automatic; he had said it so often before under similar circumstances. Besides, he could do no less. There was that large tolerance and sympathy in his nature that would permit him to do no les": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "A week of heavy reading had passed since the evening he first met Ruth, and still he dared not call. Time and again he nerved himself up to call, but under the doubts that assailed him his determinati": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "As he gazed at her and listened, his thoughts grew daring. He reviewed all the wild delight of the pressure of her hand in his at the door, and longed for it again. His gaze wandered often toward her ": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "His firmly planned intention had come to a halt on the verge of the horrible probability that he should have asked Arthur and that he had made a fool of himself. Ruth did not speak immediately. She wa": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "When she returned with the grammar, she drew a chair near his – he wondered if he should have helped her with the chair – and sat down beside him. She turned the pages of the grammar, and their heads ": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "Several weeks went by, during which Martin Eden studied his grammar, reviewed the books on etiquette, and read voraciously the books that caught his fancy. Of his own class he saw nothing. The girls o": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "During those several weeks he saw Ruth half a dozen times, and each time was an added inspiration. She helped him with his English, corrected his pronunciation, and started him on arithmetic. But thei": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "Her only experiences in such matters were of the books, where the facts of ordinary day were translated by fancy into a fairy realm of unreality; and she little knew that this rough sailor was creepin": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "After breakfast he went on with his serial. The words flowed from his pen, though he broke off from the writing frequently to look up definitions in the dictionary or to refer to the rhetoric. He ofte": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "But he was oppressed by her remoteness. She was so far from him, and he did not know how to approach her. He had been a success with girls and women in his own class; but he had never loved any of the": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "He wanted to know, and it was this desire that had sent him adventuring over the world. But he was now learning from Spencer that he never had known, and that he never could have known had he continue": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "But his chief trouble was that he did not know any editors or writers. And not merely did he not know any writers, but he did not know anybody who had ever attempted to write. There was nobody to tell": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "Her criticism was just. He acknowledged that, but he had a feeling that he was not sharing his work with her for the purpose of schoolroom correction. The details did not matter. They could take care ": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "But she was too busy in her mind, carving out a career for him that would at least be possible, to ask what the ultimate something was which he had hinted at. There was no career for him in literature": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "It was exhausting work, carried on at top speed. Out on the broad verandas of the hotel, men and women, in cool white, sipped iced drinks and kept their circulation down. But in the laundry the air wa": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "Martin took a bath, after which he found that the head laundryman had disappeared. Most likely he had gone for a glass of beer, Martin decided, but the half-mile walk down to the village to find out s": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "A third week went by, and Martin loathed himself, and loathed life. He was oppressed by a sense of failure. There was reason for the editors refusing his stuff. He could see that clearly now, and laug": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "She was sure of herself, and in a few days he would be off to sea. Then, by the time he returned, she would be away on her visit East. There was a magic, however, in the strength and health of Martin.": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "The impulse to avoid detection was mutual. The episode was tacitly and secretly intimate. She sat apart from him with burning cheeks, while the full force of it came home to her. She had been guilty o": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "She was in a fever of tingling mystery, alternately frightened and charmed, and in constant bewilderment. She had one idea firmly fixed, however, which insured her security. She would not let Martin s": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "Yet summer lingered, fading and fainting among her hills, deepening the purple of her valleys, spinning a shroud of haze from waning powers and sated raptures, dying with the calm content of having li": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "The book slipped from his hands to the ground, and they sat idly and silently, gazing out over the dreamy bay with eyes that dreamed and did not see. Ruth glanced sidewise at his neck. She was drawn b": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "And a moment later, tearing herself half out of his embrace, suddenly and exultantly she reached up and placed both hands upon Martin Eden's sunburnt neck. So exquisite was the pang of love and desire": {
            "author": "Jack London",
            "title": "Martin Eden",
            "cover": "https://i.imgur.com/3wvJCjC.png?1"
        },
        "Del was a slight, balding man with the worried face of an accountant who knows his embezzlement will soon be discovered. His tame mouse was sitting on his shoulder. Percy Wetmore was leaning in the do": {
            "author": "Stephen King",
            "title": "The Green Mile",
            "cover": "https://i.imgur.com/O9y4jVg.png?1"
        },
        "He did as I said. He had raped a young girl and killed her, and had then dropped her body behind the apartment house where she lived, doused it with coal-oil, and then set it on fire, hoping in some m": {
            "author": "Stephen King",
            "title": "The Green Mile",
            "cover": "https://i.imgur.com/O9y4jVg.png?1"
        },
        "I did, but before I did, I stepped out onto the back porch to empty out (and checked the wind direction with a wet thumb before I did – what our parents tell us when we are small seldom goes ignored, ": {
            "author": "Stephen King",
            "title": "The Green Mile",
            "cover": "https://i.imgur.com/O9y4jVg.png?1"
        },
        "Any one may judge what a condition I must be in at all this, who was but a young sailor, and who had been in such a fright before at but a little. But if I can express at this distance the thoughts I ": {
            "author": "Daniel Defoe",
            "title": "Robinson Crusoe",
            "cover": "https://i.imgur.com/UXmzxcM.png?1"
        },
        "It was my lot first of all to fall into pretty good company, which does not always happen to such loose and misguided young fellows as I then was; the devil generally not omitting to lay some snare fo": {
            "author": "Daniel Defoe",
            "title": "Robinson Crusoe",
            "cover": "https://i.imgur.com/UXmzxcM.png?1"
        },
        "The wave that came upon me again buried me at once twenty or thirty feet deep in its own body, and I could feel myself carried with a mighty force and swiftness towards the shore – a very great way; b": {
            "author": "Daniel Defoe",
            "title": "Robinson Crusoe",
            "cover": "https://i.imgur.com/UXmzxcM.png?1"
        },
        "I have already observed how I brought all my goods into this pale, and into the cave which I had made behind me. But I must observe, too, that at first this was a confused heap of goods, which, as the": {
            "author": "Daniel Defoe",
            "title": "Robinson Crusoe",
            "cover": "https://i.imgur.com/UXmzxcM.png?1"
        },
        "However, I made me a table and a chair in the first place; and this I did out of the short pieces of boards that I brought on my raft from the ship. But when I had wrought out some boards as above, I ": {
            "author": "Daniel Defoe",
            "title": "Robinson Crusoe",
            "cover": "https://i.imgur.com/UXmzxcM.png?1"
        },
        "When I got on shore first here, and found all my ship's crew drowned and myself spared, I was surprised with a kind of ecstasy, and some transports of soul, which, had the grace of God assisted, might": {
            "author": "Daniel Defoe",
            "title": "Robinson Crusoe",
            "cover": "https://i.imgur.com/UXmzxcM.png?1"
        },
        "I spent all that evening there, and went not back to my habitation; which, by the way, was the first night, as I might say, I had lain from home. In the night, I took my first contrivance, and got up ": {
            "author": "Daniel Defoe",
            "title": "Robinson Crusoe",
            "cover": "https://i.imgur.com/UXmzxcM.png?1"
        },
        "Seated with Stuart and Brent Tarleton in the cool shade of the porch of Tara, her father's plantation, that bright April afternoon, she made a pretty picture. Her new green flowered-muslin dress sprea": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Since the day of the speaking, Stuart had been uncomfortable in India's presence. Not that India ever reproached him or even indicated by look or gesture that she was aware of his abruptly changed all": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "These latter young men were as anxious to fight the Yankees, should war come, as were their richer neighbors; but the delicate question of money arose. Few small farmers owned horses. They carried on ": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "When the twins left Scarlett standing on the porch of Tara and the last sound of flying hooves had died away, she went back to her chair like a sleepwalker. Her face felt stiff as from pain and her mo": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "It was time for Gerald's return and, if she expected to see him alone, there was nothing for her to do except meet him where the driveway entered the road. She went quietly down the front steps, looki": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "She loved him and she wanted him and she did not understand him. She was as forthright and simple as the winds that blew over Tara, and to the end of her days she would never be able to understand a c": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "In the mornings, after all-night sessions at births and deaths, when old Dr. Fontaine and young Dr. Fontaine were both out on calls and could not be found to help her, Ellen presided at the breakfast ": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "But Gerald remained Gerald. His habits of living and his ideas changed, but his manners he would not change, even had he been able to change them. He admired the drawling elegance of the wealthy rice ": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "When Gerald was forty-three, so thickset of body and florid of face that he looked like a hunting squire out of a sporting print, it came to him that Tara, dear though it was, and the County folk, wit": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Here in north Georgia was a rugged section held by a hardy people. High up on the plateau at the foot of the mountains, she saw rolling red hills wherever she looked, with huge outcroppings of the und": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "And, quickening all of the affairs of the section, was the high tide of prosperity then rolling over the South. All of the world was crying out for cotton, and the new land of the County, unworn and f": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "She did not expect life to be easy, and, if it was not happy, that was woman's lot. It was a man's world, and she accepted it as such. The man owned the property, and the woman managed it. The man too": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "The rose organdie with long pink sash was becoming, but she had worn it last summer when Melanie visited Twelve Oaks and she'd be sure to remember it. And might be catty enough to mention it. The blac": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "The wide curving driveway was full of saddle horses and carriages and guests alighting and calling greetings to friends. Grinning negroes, excited as always at a party, were leading the animals to the": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "As she chattered and laughed and cast quick glances into the house and the yard, her eyes fell on a stranger, standing alone in the hall, staring at her in a cool impertinent way that brought her up s": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Time and events were telescoped, jumbled together like a nightmare that had no reality or reason. Till the day she died there would be blank spots in her memories of those days. Especially vague were ": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "But when the dancing and toasting were finally ended and the dawn was coming, when all the Atlanta guests who could be crowded into Tara and the overseer's house had gone to sleep on beds, sofas and p": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "A widow had to wear hideous black dresses without even a touch of braid to enliven them, no flower or ribbon or lace or even jewelry, except onyx mourning brooches or necklaces made from the deceased'": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Atlanta had always interested her more than any other town because when she was a child Gerald had told her that she and Atlanta were exactly the same age. She discovered when she grew older that Gera": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "So she gracefully evaded, for the time being, a definite answer as to the duration of her visit and slipped easily into the life of the red-brick house at the quiet end of Peachtree Street. Living wit": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "The hall was full of girls, girls who floated in butterfly bright dresses, hooped out enormously, lace pantalets peeping from beneath; round little white shoulders bare, and faintest traces of soft li": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "For a brief moment she considered the unfairness of it all. How short was the time for fun, for pretty clothes, for dancing, for coquetting! Then you married and wore dull-colored dresses and had babi": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Her indignant and hopeless reverie was broken when the crowd began pushing back against the walls, the ladies carefully holding their hoops so that no careless contact should turn them up against thei": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "She sighed as she carefully tied the ribbon about the packet, wondering for the thousandth time just what it was in Ashley that eluded her understanding. She tried to think the matter to some satisfac": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "The blockade about the ports had tightened, and luxuries such as tea, coffee, silks, whalebone stays, colognes, fashion magazines and books were scarce and dear. Even the cheapest cotton goods had sky": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Her thoughts and activities were the same as they had been in the old days, but the field of her activities had widened immensely. Careless of the disapproval of Aunt Pitty's friends, she behaved as s": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "And he annoyed her frequently. He was in his mid-thirties, older than any beau she had ever had, and she was as helpless as a child to control and handle him as she had handled beaux nearer her own ag": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "But sooner or later, he returned to Atlanta, called, presumably on Aunt Pitty, and presented Scarlett, with overdone gallantry, a box of bonbons he had brought her from Nassau. Or preempted a seat by ": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "He was unfailingly courteous to her, but she was a little timid with him, largely because she was shy with any man she had not known from childhood. Secretly she was very sorry for him, a feeling whic": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "The ladies could forgive and forget a great many things for such a brave man. He was a dashing figure and one that people turned to look at. He spent money freely, rode a wild black stallion, and wore": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "The doctor's letter was the first of a chorus of indignation that was beginning to be heard all over the South against speculators, profiteers and holders of government contracts. Conditions in Wilmin": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Scarlett cast down her eyes. Now, he was going to try to take liberties, just as Ellen predicted. He was going to kiss her, or try to kiss her, and she couldn't quite make up her flurried mind which i": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "She did not see that Rhett had pried open the prison of her widowhood and set her free to queen it over unmarried girls when her days as a belle should have been long past. Nor did she see that under ": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "The women did not speak, but their pale set faces pleaded with a mute eloquence that was louder than wailing. There was hardly a house in town that had not sent away a son, a brother, a father, a love": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "But Scarlett hardly heard a word he said, so enraptured was she at being in the same room with Ashley again. How could she have thought during these two years that other men were nice or handsome or e": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "So many dear memories that would bring back to him those lovely days when they roamed the County like care-free children, so many things that would call to mind the days before Melanie Hamilton entere": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "She sat on the divan in the parlor, holding her going-away gift for him in her lap, waiting while he said good-by to Melanie, praying that when he did come down the stairs he would be alone and she mi": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "All that night Turi Guiliano had not been able to sleep. Had he really been afraid of that man with the evil face and threatening body? Had he shivered like a girl? Were they all laughing at him? What": {
            "author": "Mario Puzo",
            "title": "The Sicilian",
            "cover": "https://i.imgur.com/OMd0Qux.png?1"
        },
        "Guiliano slept badly and woke in that sullen mood so dangerous in adolescent males. He seemed to himself ridiculous. He had always wanted to be a hero, like most young men. If he had lived in any othe": {
            "author": "Mario Puzo",
            "title": "The Sicilian",
            "cover": "https://i.imgur.com/OMd0Qux.png?1"
        },
        "Now Prince Ollorto, though he was an extreme reactionary politically, and like most of the Sicilian nobility had no sense of economic justice, had always a sense of identity with the lower classes. He": {
            "author": "Mario Puzo",
            "title": "The Sicilian",
            "cover": "https://i.imgur.com/OMd0Qux.png?1"
        },
        "In the end Pisciotta was proved right. Don Croce sent word through Hector Adonis that the Christian Democratic party could not get the amnesty for Guiliano and his men because of the massacre at the P": {
            "author": "Mario Puzo",
            "title": "The Sicilian",
            "cover": "https://i.imgur.com/OMd0Qux.png?1"
        },
        "The third man on horseback was Don Piddu of Caltanissetta and his steed's bridle was garlanded with flowers. He was known to be susceptible to flattery and vain of his appearance, jealous of power and": {
            "author": "Mario Puzo",
            "title": "The Sicilian",
            "cover": "https://i.imgur.com/OMd0Qux.png?1"
        },
        "At that moment, anger blinding his instinct for survival, Stefano Andolini grabbed the pistol out of the Inspector's belt holster and tried to fire. In that same instant the police officer drew his ow": {
            "author": "Mario Puzo",
            "title": "The Sicilian",
            "cover": "https://i.imgur.com/OMd0Qux.png?1"
        },
        "In her years abroad there were incidents from which she should have learned some valuable lessons. In Paris a group of tramps living under one of the bridges tried to rape her when she roamed the city": {
            "author": "Mario Puzo",
            "title": "The Fourth K",
            "cover": "https://i.imgur.com/HbEnJr5.png?1"
        },
        "Kennedy had swept the country along with him in his campaign for the presidency. He had proclaimed he would write a new social contract for the American people. What makes a civilization endure? He as": {
            "author": "Mario Puzo",
            "title": "The Fourth K",
            "cover": "https://i.imgur.com/HbEnJr5.png?1"
        },
        "The beauty of this was that the man was usually an errant husband reluctant to report the incident to the police and have to answer questions about just what he was doing in a dark hall on Ninth Avenu": {
            "author": "Mario Puzo",
            "title": "The Fourth K",
            "cover": "https://i.imgur.com/HbEnJr5.png?1"
        },
        "At Oddblood Gray's suggestion, they traveled to New York together. They walked down Fifth Avenue to lead a memorial parade to the great crater made by the atom bomb explosion. They did this to show th": {
            "author": "Mario Puzo",
            "title": "The Fourth K",
            "cover": "https://i.imgur.com/HbEnJr5.png?1"
        },
        "The first bullet caught Don Corleone in the back. He felt the hammer shock of its impact but made his body move toward the car. The next two bullets hit him in the buttocks and sent him sprawling in t": {
            "author": "Mario Puzo",
            "title": "The Godfather",
            "cover": "https://i.imgur.com/7Z0T9nw.png?1"
        },
        "Very carefully Vito took the wide wallet out of the dead man's jacket pocket and put it inside his shirt. Then he walked across the street into the loft building, through that into the yard and climbe": {
            "author": "Mario Puzo",
            "title": "The Godfather",
            "cover": "https://i.imgur.com/7Z0T9nw.png?1"
        },
        "He waited with a feeling of the utmost despair. For, he had no doubt as to what services he would be called upon to perform. For the last year the Corleone Family had waged war against the five great ": {
            "author": "Mario Puzo",
            "title": "The Godfather",
            "cover": "https://i.imgur.com/7Z0T9nw.png?1"
        },
        "Beyond the orange grove lay the green ribboned fields of a baronial estate. Down the road from the grove was a villa so Roman it looked as if it had been dug up from the ruins of Pompeii. It was a lit": {
            "author": "Mario Puzo",
            "title": "The Godfather",
            "cover": "https://i.imgur.com/7Z0T9nw.png?1"
        },
        "Richard left us on the very next evening to begin his new career, and committed Ada to my charge with great love for her and great trust in me. It touched me then to reflect, and it touches me now, mo": {
            "author": "Charles Dickens",
            "title": "Bleak House",
            "cover": "https://i.imgur.com/WffN7eg.png?1"
        },
        "Therefore I was driven at last to asking Richard if he would mind convincing me that it really was all over there, as he had said, and that it was not his mere impression. He showed me without hesitat": {
            "author": "Charles Dickens",
            "title": "Bleak House",
            "cover": "https://i.imgur.com/WffN7eg.png?1"
        },
        "But he has his revenge. Even the winds are his messengers, and they serve him in these hours of darkness. There is not a drop of Tom's corrupted blood but propagates infection and contagion somewhere.": {
            "author": "Charles Dickens",
            "title": "Bleak House",
            "cover": "https://i.imgur.com/WffN7eg.png?1"
        },
        "As she pressed me to stay to dinner, I remained, and I believe we talked about nothing but him all day. I told her how much the people liked him at Yarmouth, and what a delightful companion he had bee": {
            "author": "Charles Dickens",
            "title": "David Copperfield",
            "cover": "https://i.imgur.com/X5craNx.png?1"
        },
        "A delightful walk it was; for it was a pleasant afternoon in June, and their way lay through a deep and shady wood, cooled by the light wind which gently rustled the thick foliage, and enlivened by th": {
            "author": "Charles Dickens",
            "title": "The Pickwick Papers",
            "cover": "https://i.imgur.com/SOgekW9.png?1"
        },
        "When the man had shut the green gate after him, he walked, as we have said twice already, with a brisk pace up the courtyard; but he no sooner caught sight of Mr. Weller than he faltered, and stopped,": {
            "author": "Charles Dickens",
            "title": "The Pickwick Papers",
            "cover": "https://i.imgur.com/SOgekW9.png?1"
        },
        "It is a very ill wind that blows nobody any good. The prim man in the cloth boots, who had been unsuccessfully attempting to make a joke during the whole time the round game lasted, saw his opportunit": {
            "author": "Charles Dickens",
            "title": "The Pickwick Papers",
            "cover": "https://i.imgur.com/SOgekW9.png?1"
        },
        "And nothing ever came of it. The thing remained a secret with the three men. Nor did Daylight ever give the secret away, though that afternoon, leaning back in his stateroom on the Twentieth Century, ": {
            "author": "Jack London",
            "title": "Burning Daylight",
            "cover": "https://i.imgur.com/l92aRWi.png?1"
        },
        "Daylight awoke with the familiar parched mouth and lips and throat, took a long drink of water from the pitcher beside his bed, and gathered up the train of thought where he had left it the night befo": {
            "author": "Jack London",
            "title": "Burning Daylight",
            "cover": "https://i.imgur.com/l92aRWi.png?1"
        },
        "As I obeyed I noticed an anxious light come into Johnson's eyes, but I did not dream of its cause. I did not dream of what was to occur until it did occur, but he knew from the very first what was com": {
            "author": "Jack London",
            "title": "The Sea Wolf",
            "cover": "https://i.imgur.com/uRu9StQ.png?1"
        },
        "Wolf Larsen was steering, his eyes glistening and snapping as they dwelt upon and leaped from detail to detail of the chase. Now he studied the sea to windward for signs of the wind slackening or fres": {
            "author": "Jack London",
            "title": "The Sea Wolf",
            "cover": "https://i.imgur.com/uRu9StQ.png?1"
        },
        "It was very little that he found to say, nor did he find her responsive to that little. But he went away with the resolution to see her again. He effected his object by chance, meeting her on the pier": {
            "author": "John Galsworthy",
            "title": "The Man of Property",
            "cover": "https://i.imgur.com/2pVvz3g.jpg?1"
        },
        "Richard hung his pack over the back of his chair, taking the cat out and handing him to Kahlan. She put him in her lap, where he immediately began purring as she stroked his back. Zedd sat to his othe": {
            "author": "Terry Goodkind",
            "title": "Wizard's First Rule",
            "cover": "https://i.imgur.com/jrgCz2x.png?1"
        },
        "They continued down the dismal trail, watching the woods as they went. Richard wondered what else Zedd could do. He let his horse pick its own way in the gathering darkness, wondering how much longer ": {
            "author": "Terry Goodkind",
            "title": "Wizard's First Rule",
            "cover": "https://i.imgur.com/jrgCz2x.png?1"
        },
        "Richard helped Kahlan up onto her horse. He could tell that her legs hurt more than she would admit. He gave her the reins of Zedd's horse, mounted up, took Chase's horse, and then carefully got his b": {
            "author": "Terry Goodkind",
            "title": "Wizard's First Rule",
            "cover": "https://i.imgur.com/jrgCz2x.png?1"
        },
        "Licking the honey off his fingers, he wove his way across the street, around horses pulling carts and wagons, and between the crush of people going about their business. At times, it was like trying t": {
            "author": "Terry Goodkind",
            "title": "Blood Of The Fold",
            "cover": "https://i.imgur.com/gew1FfJ.png?1"
        },
        "Richard released the font. He lifted his fists as he staggered back. The gazing font exploded apart, heavy pieces of rock driven ahead of huge gouts of flame and smoke. Shards of stone whistled throug": {
            "author": "Terry Goodkind",
            "title": "Temple Of The Winds",
            "cover": "https://i.imgur.com/xrNE3BM.png?1"
        },
        "The second pitch was a high curveball, and with the count of two balls, you could almost hear the fans get out of their seats. A baseball was about to get ripped into some remote section of Sportsman'": {
            "author": "John Grisham",
            "title": "A Painted House",
            "cover": "https://i.imgur.com/ZWMcRTR.png?1"
        },
        "Next to Pop and Pearl's I saw Mr. Lynch Thornton, the postmaster, unlock the door to the post office and step inside. I walked toward him, keeping a watchful eye on the truck. Mr. Thornton was usually": {
            "author": "John Grisham",
            "title": "A Painted House",
            "cover": "https://i.imgur.com/ZWMcRTR.png?1"
        },
        "Then her husband died, and she remarried a local alcoholic twenty years her junior. When sober, he was semiliterate and fancied himself as a tortured poet and essayist. Miss Emma loved him dearly and ": {
            "author": "John Grisham",
            "title": "The Last Juror",
            "cover": "https://i.imgur.com/2TyhhNC.png?1"
        },
        "He supposed he should at least scout around now. If he was careful, he wouldn't even have to disturb Kayan to do it. He focused his awareness inward, reaching for the center of his psionic power, the ": {
            "author": "Ryan Hughes",
            "title": "The Darkness Before the Dawn",
            "cover": "https://i.imgur.com/FOSmEI8.png?1"
        },
        "The mescal wasn't water, though; two men went blind for awhile, and several others were troubled by visions of torture and dismemberment. Such visions, at the time, were not hard to conjure up, even w": {
            "author": "Larry McMurtry",
            "title": "Dead Man's Walk",
            "cover": "https://i.imgur.com/TPwrwE5.png?1"
        },
        "Bigfoot didn't answer. He felt he could survive in the wilds as well as the next man, and there was no man he feared; but there were quite a few he respected enough to be cautious of, and Buffalo Hump": {
            "author": "Larry McMurtry",
            "title": "Dead Man's Walk",
            "cover": "https://i.imgur.com/TPwrwE5.png?1"
        },
        "Bigfoot came over and looked at the arrow, too. The woman's body didn't budge. It was as if it were nailed to the ground. It was a small, skinny arrow, the shaft a little bent. Call tried to imagine t": {
            "author": "Larry McMurtry",
            "title": "Dead Man's Walk",
            "cover": "https://i.imgur.com/TPwrwE5.png?1"
        },
        "Salazar, too, felt that he would not survive the night. The wound Caleb Cobb had given him was worse than he had thought – he had bled all day, the blood freezing on his coat. Now a soldier had awaken": {
            "author": "Larry McMurtry",
            "title": "Dead Man's Walk",
            "cover": "https://i.imgur.com/TPwrwE5.png?1"
        },
        "When he saw that the Texans were not going to go chase him to the Rio Pecos he rested for three days in a little cave he had found. He built a warm fire and feasted on the tender meat of one of the yo": {
            "author": "Larry McMurtry",
            "title": "Comanche Moon",
            "cover": "https://i.imgur.com/Ah6tp2O.png?1"
        },
        "Goyeto peeled the strip of skin up the unconscious caballero's chest and up his neck to his chin. Then he cut it off and walked away with the thin, light strip. He meant to peg it out, salt it a littl": {
            "author": "Larry McMurtry",
            "title": "Comanche Moon",
            "cover": "https://i.imgur.com/Ah6tp2O.png?1"
        },
        "Undoubtedly Ahumado would post guards, but Scull had been a commander too long to believe that any arrangement that required men to stay awake long hours in the night was foolproof. If he could sneak ": {
            "author": "Larry McMurtry",
            "title": "Comanche Moon",
            "cover": "https://i.imgur.com/Ah6tp2O.png?1"
        },
        "Famous Shoes knew he had made a tremendous discovery. He was glad, now, that he had been sent after Captain McCrae; because of it he had found the place where the Old People had once lived. He wrapped": {
            "author": "Larry McMurtry",
            "title": "Comanche Moon",
            "cover": "https://i.imgur.com/Ah6tp2O.png?1"
        },
        "In the night, after they left the spring, it was he, rather than the black horse, that faltered. By the middle of the next day he was as unsteady on his feet as a baby just learning to balance himself": {
            "author": "Larry McMurtry",
            "title": "Comanche Moon",
            "cover": "https://i.imgur.com/Ah6tp2O.png?1"
        },
        "The Captain had stepped out on the back porch and was looking north, along the stage road that threaded its way through the brush country toward San Antonio. The road ran straight for a considerable d": {
            "author": "Larry McMurtry",
            "title": "Lonesome Dove",
            "cover": "https://i.imgur.com/TqcoFH3.png?1"
        },
        "Joey Garza had struck seven times, stopping trains in remote areas of the Southwest, where trains were rarely bothered. He had killed eleven men so far, seemingly selecting his victims at random. Seve": {
            "author": "Larry McMurtry",
            "title": "Streets of Laredo",
            "cover": "https://i.imgur.com/bmG1Eyz.png?1"
        },
        "John Wesley Hardin had noticed Joey come in. He was certainly a pretty boy, too pretty to last, Hardin thought. His clothes were too clean. In such a place, it was irritating to see a boy with clothes": {
            "author": "Larry McMurtry",
            "title": "Streets of Laredo",
            "cover": "https://i.imgur.com/bmG1Eyz.png?1"
        },
        "The lack of laughter in her life was a thing Maria held against men. She felt she had the temperament to be a happy woman, if she was not interfered with, too much. She knew that it was her fault that": {
            "author": "Larry McMurtry",
            "title": "Streets of Laredo",
            "cover": "https://i.imgur.com/bmG1Eyz.png?1"
        },
        "Call knew he had a ticklish decision to make. He could keep the men with him, try to catch up with Mox Mox, and hit him in force, such as the force was. Or, he could go alone, and hope to ambush Mox M": {
            "author": "Larry McMurtry",
            "title": "Streets of Laredo",
            "cover": "https://i.imgur.com/bmG1Eyz.png?1"
        },
        "Brookshire went boldly out of camp. He walked along at a good pace, trying to maintain a staunch attitude. Sometimes in Brooklyn, if he was on the streets late and had to walk past bullies or louts, h": {
            "author": "Larry McMurtry",
            "title": "Streets of Laredo",
            "cover": "https://i.imgur.com/bmG1Eyz.png?1"
        },
        "The foremost fact was that Homo sapiens had no business among the stars. Eventually, yes, when he was ready, then let him go forth. But first he should put his own house in order. One could actually a": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "When everything was in order, Brodersen ordered all systems left on automatic and all hands to the common room. On his way there from the command center (which his mind, remembering cruises along Juan": {
            "author": "Poul Anderson",
            "title": "The Avatar",
            "cover": "https://i.imgur.com/VBlBHJp.png?1"
        },
        "Countless times, Harry had been on the point of unlocking Hedwig's cage by magic and sending her to Ron and Hermione with a letter, but it wasn't worth the risk. Underage wizards weren't allowed to us": {
            "author": "J.K. Rowling",
            "title": "Harry Potter and the Chamber of Secrets",
            "cover": "https://i.imgur.com/ylwM7v2.png?1"
        },
        "Weeds were not the only things Frank had to contend with either. Boys from the village made a habit of throwing stones through the windows of the Riddle House. They rode their bicycles over the lawns ": {
            "author": "J.K. Rowling",
            "title": "Harry Potter and the Goblet of Fire",
            "cover": "https://i.imgur.com/C38jTta.png?1"
        },
        "Harry felt as though he were carrying some kind of talisman inside his chest over the following two weeks, a glowing secret that supported him through Umbridge's classes and even made it possible for ": {
            "author": "J.K. Rowling",
            "title": "Harry Potter and the Order of the Phoenix",
            "cover": "https://i.imgur.com/L6KhcfN.png?1"
        },
        "Professor Umbridge left Hogwarts the day before the end of term. It seemed that she had crept out of the hospital wing during dinnertime, evidently hoping to depart undetected, but unfortunately for h": {
            "author": "J.K. Rowling",
            "title": "Harry Potter and the Order of the Phoenix",
            "cover": "https://i.imgur.com/L6KhcfN.png?1"
        },
        "Yet Harry could not help himself talking to Ginny, laughing with her, walking back from practice with her; however much his conscience ached, he found himself wondering how best to get her on her own.": {
            "author": "J.K. Rowling",
            "title": "Harry Potter and the Half-Blood Prince",
            "cover": "https://i.imgur.com/BmjkKmZ.png?1"
        },
        "Harry had never made it to dinner; he had no appetite at all. He had just finished telling Ron, Hermione, and Ginny what had happened, not that there seemed to have been much need. The news had travel": {
            "author": "J.K. Rowling",
            "title": "Harry Potter and the Half-Blood Prince",
            "cover": "https://i.imgur.com/BmjkKmZ.png?1"
        },
        "It took him about five hours to get ready. While he was doing it, I went over to my window and opened it and packed a snowball with my bare hands. The snow was very good for packing. I didn't throw it": {
            "author": "J. D. Salinger",
            "title": "The Catcher in the Rye",
            "cover": "https://i.imgur.com/aYvz4Zm.png?1"
        },
        "What I did do, I gave old Sally Hayes a buzz. She went to Mary A. Woodruff, and I knew she was home because I'd had this letter from her a couple of weeks ago. I wasn't too crazy about her, but I'd kn": {
            "author": "J. D. Salinger",
            "title": "The Catcher in the Rye",
            "cover": "https://i.imgur.com/aYvz4Zm.png?1"
        },
        "The thought of dishes caused Mrs. Straughan to frown thoughtfully, and she propelled herself into the back section of the kitchen where the two big automatic dishwashers were installed. This was a par": {
            "author": "Arthur Hailey",
            "title": "The Final Diagnosis",
            "cover": "https://i.imgur.com/Lb5Khtj.png?1"
        },
        "Watching McNeil, his hands steady and competent, Seddons found himself wondering again what went on in the pathology resident's mind. He had known McNeil for two years, first as a fellow resident, tho": {
            "author": "Arthur Hailey",
            "title": "The Final Diagnosis",
            "cover": "https://i.imgur.com/Lb5Khtj.png?1"
        },
        "Lucy respected the chief of surgery's efforts to achieve improvement within the hospital without major upheavals, though she knew from observation that O'Donnell would never shun an issue if it really": {
            "author": "Arthur Hailey",
            "title": "The Final Diagnosis",
            "cover": "https://i.imgur.com/Lb5Khtj.png?1"
        },
        "For David Coleman, too, the waiting was hard. He knew himself to be almost as tense as Pearson, although at this moment the older man was showing his anxiety more. For the first time Coleman realized ": {
            "author": "Arthur Hailey",
            "title": "The Final Diagnosis",
            "cover": "https://i.imgur.com/Lb5Khtj.png?1"
        },
        "As the whisperings merged together violently, questioning, interrupting, Scarlett felt herself go cold with fear and humiliation. Honey was a fool, a silly, a simpleton about men, but she had a femini": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "That radiance lasted until everyone in the circle about the open fire began to yawn, and Mr. Wilkes and the girls took their departure for the hotel. Then as Ashley and Melanie and Pittypat and Scarle": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Common sense told them that unless Ashley developed wings, it would be weeks or even months before he could travel from Illinois to Georgia, but hearts nevertheless beat wildly whenever a soldier turn": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "There was nothing else she did have, nothing but this red land, this land she had been willing to throw away like a torn handkerchief only a few minutes before. Now, it was dear to her again and she w": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Scarlett lay quietly for a while, as Mammy fussed about the room, relief flooding her that there was no need for words between them. No explanations were asked, no reproaches made. Mammy understood an": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "But no one wanted to forget, no one, it seemed, except herself, so Scarlett was glad when she could truthfully tell Melanie that she was embarrassed at appearing, even in the darkness. This explanatio": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "There were three rooms in the basement of Melanie's house which formerly had been servants' quarters and a wine room. Now Dilcey occupied one, and the other two were in constant use by a stream of mis": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "It seemed to Scarlett that after Archie came to work for her Frank was away at night very frequently. He said the books at the store had to be balanced and business was brisk enough now to give him li": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Scarlett, straining her eyes past Rhett, felt her heart beat again as she saw Ashley's eyes open. Melanie snatched a folded towel from the washstand rack and pressed it against his streaming shoulder ": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Some of the feeling of bitter hatred the women bore Scarlett for her share in the tragedy was mitigated by the knowledge that her husband was dead and she knew it and could not admit it and have the p": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "She did not hesitate to display arrogance to her new Republican and Scalawag friends but to no class was she ruder or more insolent than the Yankee officers of the garrison and their families. Of all ": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "The upshot of the situation was that Bonnie was removed from the nursery to the room Rhett now occupied alone. Her small bed was placed beside his large one and a shaded lamp burned on the table all n": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Scarlett shook as with a chill at the thought. She must have a drink, a number of drinks before she could lie down and hope to sleep. She threw a wrapper about her gown and went hastily out into the d": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Rhett loved her! At least, he said he loved her and how could she doubt it now? How odd and bewildering and how incredible that he loved her, this savage stranger with whom she had lived in such cooln": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "Now that her first rage at Rhett and his insults had passed, she began to miss him and she missed him more and more as days went by without news of him. Out of the welter of rapture and anger and hear": {
            "author": "Margaret Mitchell",
            "title": "Gone with the Wind",
            "cover": "https://i.imgur.com/f7z0yKR.png?1"
        },
        "The spouse of Aule is Yavanna, the Giver of Fruits. She is the lover of all things that grow in the earth, and all their countless forms she holds in her mind, from the trees like towers in forests lo": {
            "author": "J.R.R. Tolkien",
            "title": "The Silmarillion",
            "cover": "https://i.imgur.com/jmRPG66.png?1"
        },
        "It is not said that Aredhel was wholly unwilling, nor that her life in Nan Elmoth was hateful to her for many years. For though at Eol's command she must shun the sunlight, they wandered far together ": {
            "author": "J.R.R. Tolkien",
            "title": "The Silmarillion",
            "cover": "https://i.imgur.com/jmRPG66.png?1"
        },
        "Then Luthien stood upon the bridge, and declare her power: and the spell was loosed that bound stone to stone, and the gates were thrown down, and the walls opened, and the pits laid bare; and many th": {
            "author": "J.R.R. Tolkien",
            "title": "The Silmarillion",
            "cover": "https://i.imgur.com/jmRPG66.png?1"
        },
        "There Beren slunk in wolf's form beneath his throne; but Luthien was stripped of her disguise by the will of Morgoth, and he bent his gaze upon her. She was not daunted by his eyes; and she named her ": {
            "author": "J.R.R. Tolkien",
            "title": "The Silmarillion",
            "cover": "https://i.imgur.com/jmRPG66.png?1"
        },
        "And Tuor remained in Gondolin, for its bliss and its beauty and the wisdom of its people held him enthralled; and he became mighty in stature and in mind, and learned deeply of the lore of the exiled ": {
            "author": "J.R.R. Tolkien",
            "title": "The Silmarillion",
            "cover": "https://i.imgur.com/jmRPG66.png?1"
        },
        "They still went on and on. The rough path disappeared. The bushes, and the long grasses, between the boulders, the patches of rabbit cropped turf, the thyme and the sage and the marjoram, and the yell": {
            "author": "J.R.R. Tolkien",
            "title": "The Hobbit, or There and Back Again",
            "cover": "https://i.imgur.com/cobR0Ir.png?1"
        },
        "This glade in the ring of trees was evidently a meeting place of the wolves. More and more kept coming in. They left guards at the foot of the tree in which Dori and Bilbo were, and then went snifflin": {
            "author": "J.R.R. Tolkien",
            "title": "The Hobbit, or There and Back Again",
            "cover": "https://i.imgur.com/cobR0Ir.png?1"
        },
        "This was dreadful talk to listen to, not only because of the brave woodmen and their wives and children, but also because of the danger which now threatened Gandalf and his friends. The Wargs were ang": {
            "author": "J.R.R. Tolkien",
            "title": "The Hobbit, or There and Back Again",
            "cover": "https://i.imgur.com/cobR0Ir.png?1"
        },
        "The nights were the worst. It then became pitch dark, not what you call pitchdark, but really pitch; so black that you really could see nothing. Bilbo tried flapping his hand in front of his nose, but": {
            "author": "J.R.R. Tolkien",
            "title": "The Hobbit, or There and Back Again",
            "cover": "https://i.imgur.com/cobR0Ir.png?1"
        },
        "Indeed they really expected him to think of some wonderful plan for helping them, and were not merely grumbling. They knew only too well that they would soon all have been dead, if it had not been for": {
            "author": "J.R.R. Tolkien",
            "title": "The Hobbit, or There and Back Again",
            "cover": "https://i.imgur.com/cobR0Ir.png?1"
        },
        "The king had ordered them to make haste. Suddenly the torches stopped, and the hobbit had just time to catch them up before they began to cross the bridge. This was the bridge that led across the rive": {
            "author": "J.R.R. Tolkien",
            "title": "The Hobbit, or There and Back Again",
            "cover": "https://i.imgur.com/cobR0Ir.png?1"
        },
        "Now the very last barrel was being rolled to the doors! In despair and not knowing what else to do, poor little Bilbo caught hold of it and was pushed over the edge with it. Down into the water he fel": {
            "author": "J.R.R. Tolkien",
            "title": "The Hobbit, or There and Back Again",
            "cover": "https://i.imgur.com/cobR0Ir.png?1"
        },
        "He seemed so much in earnest that the dwarves at last did as he said, though they delayed shutting the door, it seemed a desperate plan, for no one knew whether or how they could get it open again fro": {
            "author": "J.R.R. Tolkien",
            "title": "The Hobbit, or There and Back Again",
            "cover": "https://i.imgur.com/cobR0Ir.png?1"
        },
        "That view was somehow disquieting; so they turned from the sight and went down into the hollow circle. In the midst of it there stood a single stone, standing tall under the sun above, and at this hou": {
            "author": "J.R.R. Tolkien",
            "title": "The Fellowship of the Ring",
            "cover": "https://i.imgur.com/6Yfqsp4.png?1"
        },
        "Then all listened while Elrond in his clear voice spoke of Sauron and the Rings of Power, and their forging in the Second Age of the world long ago. A part of his tale was known to some there, but the": {
            "author": "J.R.R. Tolkien",
            "title": "The Fellowship of the Ring",
            "cover": "https://i.imgur.com/6Yfqsp4.png?1"
        },
        "They took me and they set me alone on the pinnacle of Orthanc, in the place where Saruman was accustomed to watch the stars. There is no descent save by a narrow stair of many thousand steps, and the ": {
            "author": "J.R.R. Tolkien",
            "title": "The Fellowship of the Ring",
            "cover": "https://i.imgur.com/6Yfqsp4.png?1"
        },
        "The answer came almost immediately. The cries of Grishnbkh had roused the Orcs. From the yells and screeches that came from the knoll the hobbits guessed that their disappearance had been discovered; ": {
            "author": "J.R.R. Tolkien",
            "title": "The Two Towers",
            "cover": "https://i.imgur.com/ZMVLx71.png?1"
        },
        "The land had changed. Where before the green dale had lain, its grassy slopes lapping the ever mounting hills, there now a forest loomed. Great trees, bare and silent, stood, rank on rank, with tangle": {
            "author": "J.R.R. Tolkien",
            "title": "The Two Towers",
            "cover": "https://i.imgur.com/ZMVLx71.png?1"
        },
        "Pippin sat with his knees drawn up and the ball between them. He bent low over it, looking like a greedy child stooping over a bowl of food, in a corner away from others. He drew his cloak aside and g": {
            "author": "J.R.R. Tolkien",
            "title": "The Two Towers",
            "cover": "https://i.imgur.com/ZMVLx71.png?1"
        },
        "He came at last by arched streets and many fair alleys and pavements to the lowest and widest circle, and there he was directed to the Lampwrights' Street, a broad way running towards the Great Gate. ": {
            "author": "J.R.R. Tolkien",
            "title": "The Return of the King",
            "cover": "https://i.imgur.com/U6bYX1h.png?1"
        },
        "For a while the three companions walked together, speaking of this and that turn of the battle, and they went down from the broken gate, and passed the mounds of the fallen on the greensward beside th": {
            "author": "J.R.R. Tolkien",
            "title": "The Return of the King",
            "cover": "https://i.imgur.com/U6bYX1h.png?1"
        },
        "It was late in the afternoon when the leaders came to wide grey thickets stretching beyond the eastward side of Amon Don, and masking a great gap in the line of hills that from Nardol to Don ran east ": {
            "author": "J.R.R. Tolkien",
            "title": "The Return of the King",
            "cover": "https://i.imgur.com/U6bYX1h.png?1"
        },
        "The new 'Chief' evidently had means of getting news. It was a good forty miles from the Bridge to Bag End, but someone made the journey in a hurry. So Frodo and his friends soon discovered. They had n": {
            "author": "J.R.R. Tolkien",
            "title": "The Return of the King",
            "cover": "https://i.imgur.com/U6bYX1h.png?1"
        }
    };

    localStorage[localStorageName] = JSON.stringify(coversMap);
    // localStorage[localStorageName] = coversMapJson;
})();
