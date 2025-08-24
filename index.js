// index.js
require('dotenv').config();

const mineflayer = require('mineflayer');
const tpsPlugin = require('mineflayer-tps')(mineflayer);

const utils = require('./util');
const createCommands = require('./commands');
const registerEvents = require('./events');
const requiredVars = ["MC_PASSWORD", "STORAGE_REPO_TOKEN", "MAIN_REPO_PAT"];
const placeholders = ["ghp_yourtokenhere", "123456"];

for (const v of requiredVars) {
  if (!process.env[v]) {
    throw new Error(`${v} is not set`);
  }
  if (placeholders.includes(process.env[v])) {
    throw new Error(`${v} is still set to a placeholder value`);
  }
}



let started_saving = false // this is so bot wont spam in console that it saved and loaded data constantly.

function startup() {
    const PASSWORD = process.env.MC_PASSWORD;

    const prefix = '-';

    const bot = mineflayer.createBot({
        host: 'eu.6b6t.org',
        port: 25565,
        username: '.22',
        version: '1.19.4',
        keepAlive: true,
    });

    const state = {
        PASSWORD,
        prefix,
        loggedIn: false,
        spawnedIn: 0,
        global_deaths: 0,
        deaths: 0,
        hotspot_death: false,
        crystalled: 0,
        server_restart: 0,
        current_count: 0,
        crystal_kills: {},
        crystal_deaths: {},
        quotes: {},
        avg_ping: [],
        marriages: {},
        pendingMarriage: {},
        pendingDivorce: {},
        totalStats: {},
        sessions: {},
        joined: 0,
        quitted: 0,
        timeLast: 0,
        currentWorldAge: 0, 
        recent_join: '',
        recent_quit: '',
        newest_player: false,
        scan_hotspot: false,
        auto_tp: false,
        tips_started: false,
        welcomer: false,
        bot_uses: 0,
        bot_tips_sent: 0,
        ads_seen: 0,
        cooldowns: [],
        dupe_mentioned: 0,
        vined_on_top_deaths: 0,
        i_am_vined_deaths: 0,
        damix_deaths: 0,
        cooldown: 0,
        temp_blacklist: utils.temp_blacklist,
        spam_count: utils.spam_count,
        spam_offenses: utils.spam_offenses,
        restart: true,
        restarted: false,
        whitelist: utils.whitelist,
        joindates: {},
        whitelisted_users: utils.whitelisted_users,
        get_uptime: utils.get_uptime,
        random_element: utils.random_element,
        get_random_ip: utils.get_random_ip,
        return_user: utils.return_user,
        checkSpam: utils.checkSpam,
        blacklist: utils.blacklist,
        get_kd: utils.get_kd,
        safeChat: utils.safeChat,
        handlePercentCmd: utils.handlePercentCmd,
        handleTargetCommand: utils.handleTargetCommand,
        saveBotData: utils.saveBotData,
        startAutoSave: utils.startAutoSave,
        getCurrentTPS: utils.getCurrentTPS,
        getCurrentTPSInstant: utils.getCurrentTPSInstant,
        getServerTPS: utils.getServerTPS,  
        fetchJD: utils.fetchJD,      
        roasts: [
            "Your birth certificate is a griefing report.", "You're why the `/kill` command exists.",
            "Even Void wouldn't want to touch you.", "You look like a lag spike made human.",
            "You're built like chunk errors.", "Your existence is an exploit Mojang never patched.",
            "Even Herobrine avoids you.", "Your face got banned from resource packs.",
            "You're the human version of a corrupted world.", "You have less presence than a ghost ping.",
            "Even Crystal PvPers think you're too toxic.", "You're a walking .jar file of bad decisions.",
            "You could crash a server just by speaking.", "You look like you PvP with auto-tune.",
            "You make ChatGPT regret being open source.", "You're the kind of bug that never gets fixed.",
            "You got dropped harder than server TPS.", "You're more unstable than an alpha build.",
            "You get kicked from life with 'Flying is not enabled'.", "You're not even worth the server's storage space.",
            "You're like 0b0t — broken, laggy, and forgotten.", "Even Bedrock Edition wants nothing to do with you.",
            "You're just a renamed Barrier block.", "You're the reason `ban-ip` exists.",
            "You're proof that spawn camping applies to real life.", "You griefed your own potential."
        ],
        insults: [
            "L ratio", "Cope", "No maidens", "You fell off", "Built like a furnace", "You sniff bedrock", 
            "Laggy, broke, AND cringe", "Your parents use 1.8.9"
        ],
        // blame chatgpt for fetish_results i just asked for ideas and he gave me the whole list - Damix2131
        fetish_results: [
            // Body part focused
            "Feet", "Hands", "Thighs", "Butts", "Armpits", "Necks", "Ears", "Eyes", "Nipples", "Hair",
        
            // Clothing / aesthetic
            "Latex", "Leather", "Stockings", "Corsets", "Lingerie", "Heels", "Uniforms", "Socks", "Pantyhose",
            "Glasses", "Goth aesthetics", "Piercings", "Tattoos", "Mask kink", "Business suits", "Sweaters",
        
            // Roleplay / identity
            "Futa", "Femboys", "Monster girls", "Slime girls", "Giantess", "Robots", "Pet play", "Yandere roleplay",
            "Cosplay kink", "Age regression (non-sexual)", "Gender play", "Crossdressing", "Objectification",
            "DILFs", "MILFs", "Clowns", "Nuns", "Maids", "Neko play", "Bunny girls", "Goblins", "Fairies",
            "Goth Latina Mommy",
        
            // Power dynamics / BDSM
            "Dom/sub dynamics", "Bondage", "Sadism", "Masochism", "Choking", "Breathplay", "Wax play",
            "Electrostimulation", "Shibari (Japanese rope bondage)", "Temperature play", "Sensory deprivation",
            "Praise kink", "Degradation kink", "Slave", "Master", "Femdom", "Maledom", "Cuckoldry", "Public humiliation",
        
            // Fluids / body stuff
            "Lactation", "Watersports", "Rimming", "Cumplay", "Sweat kink", "Scent kink", "Breast worship",
            "Thigh worship", "Armpit fetish", "Throat-fucking", "Nipple play", "Face sitting",
        
            // Psychological / edgy themes
            "Corruption kink", "Mind control (consensual fantasy)", "Hypnosis", "Brainwashing", "Petification",
            "Exhibitionism", "Voyeurism", "Jealousy kink", "Stalking fantasy", "Possessiveness", "Fear play",
            "Gun kink", "Knife kink", "Danger kink", "ASMR kink", "Voice kink", "Voice domination",
        
            // Paraphilias / fantasy
            "Inflation", "Tentacles", "NTR", "Vore", "Breeding kink", "Impregnation kink", "Alien kink",
            "Body modification", "Zombie attraction", "Monster transformation", "Amputee attraction",
            "Food play", "Plushophilia", "Guro (non-visual)", "Size difference", "Stomping", "Giant robots"
        ],
        gender_results: [
            "Male", "Female", "Attack Helicopter", "Goofy", "None", "Yes", "All of them"
        ],
        npc_replies: [
            "NPC detected", "Real human", "Side quest giver",
            "Main character", "Background filler", "Silent NPC"
        ],
        cap_replies: [
            "No cap", "This is cap", "Lying through teeth", 
            "Cap detected", "100% truth", "Literal fiction"
        ],
        screen_replies: [
            "Discord open", "Reddit at max brightness", "Minecraft launcher",
            "Horny Twitter tab", "YouTube shorts addiction", "Roblox", 
            "NSFW folder named 'homework'", "Excel pretending to work"
        ],
        illnesses: [
            "Schizophrenia", "ADHD", "Autism", "Bipolar", "Depression",
            "Anxiety", "OCD", "Borderline Personality", "Sociopathy"
        ],
        sizes: ["A", "B", "C", "D", "DD", "E", "F", "G", "H", "Z"],
        answers: [
            "Yes", "No", "Maybe", "Definitely", "Try again later",
            "Absolutely", "Not a chance", "Don't count on it", "Looks good", "Sus"
        ],
        spam_messages: [
            "Want your own custom command? Suggest it by running -discord!",
            "Bot has a quote system? Try -quote <username/random>!",
            "Use -quote <username/random> to read the dumbest things people said!",
            "Think you're the smartest? Prove it with -iq!",
            "Curious about someone's IQ? Use -iq <username/random>!",
            "Commands too many? Use -help to browse by pages!",
            "Track who joined recently with -playerjoins!",
            "Want to know who ragequit last? Try -playerquits!",
            "Wondering if the server's dying? Check the TPS with -tps!",
            "The Bot has been made by Damix2131, Try it out by running -help!",
            "Still got <Malachite> Virus?, We are still secure of it, run -help to see it yourself!",
            "Forgot when you joined? Give -jd <username> a try!",
            "Need average ping stats? Use -avgping!",
            "Stay informed with server restart time: -restart",
            "Check who's been fragged the most using -topkills!",
            "Is the bot alive? Check with -uptime!",
            "Curious how many times the bot died? Use -deaths!",
            "Check your KD ratio with -kd <username/random>!",
            "See who's lagging with -ping <username/random>!",
            "See how many players are online with -playerlist!",
            "See the bot's total usage with -stats!",
            "What's the weather in-game? Check -weather!",
            "Want to know the time of day or moon phase? Use -time!",
            "Feeling indecisive? Let the bot choose with -choose option1, option2...",
            "Start a counting game with -count <number>!",
            "Shake the 8-ball with -8ball!",
            "Roll a random number with -roll!",
            "Flip a coin and let fate decide with -flip!",
            "Rate someone with -rate <username/random>!",
            "Who's the biggest simp? Try -simp <username/random>!",
            "Check your cringe levels with -cringe <username/random>!",
            "Check how based someone is using -based <username/random>!",
            "Check how cringe someone is using -cringe <username/random>!",
            "Insult someone like a boss: -insult <username/random>!",
            "Diagnose someone with a mental illness using -mental <username/random>!",
            "Find out who's the most racist with -racist <username/random>!",
            "Expose lies with -cap <username/random>!",
            "Someone annoying? Tell them to shut up: -stfu <username/random>!",
            "See how paranoid your friends are with -paranoia <username/random>!",
            "Who's an NPC? Find out using -npc <username/random>!",
            "Curious what someone's screen looks like? Try -screen <username/random>!",
            "Measure pp size with -pp <username/random>!",
            "Check someone's boob size with -boobs <username/random>!",
            "Reveal your hidden fetish with -fetish <username/random>!",
            "Expose your gender identity with -gender <username/random>!",
            "Find out how much of a gooner someone is: -gooner <username/random>!",
            "Reveal how trans someone is with -trans <username/random>!",
            "Reveal how gay someone is with -gay <username/random>!",
            "Reveal how lesbian someone is with -lesbian <username/random>!",
            "Reveal how femboy someone is with -femboy <username/random>!",
            "Reveal how aryan someone is with -aryan <username/random>!",
            "Reveal how white someone is with -white <username/random>!",
            "Make love, not war: -love <user1> <user2>",
            "Use -turkish to find your Turkish bloodline!",
            "Use -swedish to check your inner IKEA ancestry!",
            "Use -european to find out how generic you are!",
            "Use -flip to flip a coin!",
            "Use -roll to roll a number!",
            "Use -choose option1, option2... to let the bot decide!",
            "Wondering what someone is? Try -gender!",
            "Wondering if someone is an NPC? Use -npc!",
            "Want to know how smart someone is? Use -iq!",
            "Want to diagnose someone? Use -mental!",
            "Want to know their secret kinks? Try -fetish!",
            "Is someone lying? Use -cap <username/random>!",
            "Is someone a simp? Use -simp <username/random>!",
            "Feeling cringe? Use -cringe <username/random>!",
            "Who's the most based? Use -based <username/random>!",
            "Reveal your inner lesbian with -lesbian!",
            "See boob size with -boobs!",
            "Find out who's a gooner using -gooner!",
            "Feeling romantic? Try -love <user1> <user2>!",
            "How racist are you? Use -racist <username/random>!",
            "Want to dox someone or your friends? Try out -dox <username/random>!",
            "Tell someone to kill themselves with -kys <username/random!>",
            "Feeling a little black? Check yourself or someone with -nigger <username/random!>",            
            "Test mental state with -mental <username/random>!",
            "Reveal someone's inner aryan with -aryan <username/random>!",
            "Check average ping across all players with -avgping!",
            "Check the current weather using -weather!",
            "See the current Minecraft time using -time!",
            "Say thanks to the bot with -discord!"
        ],
        blacklisted_messages: [
            '---------------------------',
            'players sleeping',
            'You can vote! Type /vote to get more homes, lower cooldowns & white username color!',
            'Remember to /vote'
        ],
        responses: {
            "You are not allowed to teleport while in the 5000x5000 overworld spawn area!": () => {
                bot.chat("I can't teleport currently.");
            }
        }
    };

    // Load commands and assign to state
    const { public_commands, admin_commands } = require('./commands');
    state.public_commands = public_commands;
    state.admin_commands = admin_commands;

    // Register event listeners with bot and state
    registerEvents(bot, state);
    if (!started_saving) {
        utils.loadBotData(state);
        utils.startAutoSave(state);
        started_saving = true
    }
    bot.loadPlugin(tpsPlugin);

    // Expose startup globally for reconnect on disconnect
    global.startup = startup;
}

startup();

