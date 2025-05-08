// // main.js
// const { launchBrowser } = require("./browser");
// const { scrapeNovelDetails, scrapeChapters } = require("./scraper");
// const { 
//   insertNovel, 
//   insertChapters, 
//   checkNovelExists,
//   getLatestChapterNumber,
//   closeDbConnection
// } = require("./DatabaseOperations");

// // Main execution function
// async function main() {
//     const url = "https://www.mvlempyr.com/novel/reawakening-sss-rank-villains-pov"; // Target URL
//     const browser = await launchBrowser();
//     const page = await browser.newPage();
    
//     try {
//         // Set up the page
//         await page.setUserAgent(
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
//         );
//         await page.goto(url, { waitUntil: "networkidle2" });

//         // Scrape novel details
//         const novelData = await scrapeNovelDetails(page);
//         console.log("Novel information:", novelData);

//         if (!novelData.title || !novelData.author) {
//             console.log("Missing essential novel data (title or author). Exiting.");
//             return;
//         }

//         // Store novel in database or get existing ID
//         const novelId = await insertNovel({
//             title: novelData.title,
//             author: novelData.author,
//             description: novelData.synopsis,
//             cover_image_url: novelData.imageLink,
//             tags: novelData.tags,
//             genres: novelData.genres,
//             status: novelData.status,
//         });

//         if (!novelId) {
//             console.log("Failed to process novel data. Exiting.");
//             return;
//         }

//         // Get latest chapter from DB to determine how many chapters to scrape
//         const latestChapterNumber = await getLatestChapterNumber(novelId);
//         console.log(`Current chapters in database: ${latestChapterNumber}`);
//         console.log(`Total chapters on site: ${novelData.numOfCh}`);

//         if (latestChapterNumber >= novelData.numOfCh) {
//             console.log("Novel is already up to date. No new chapters to scrape.");
//             return;
//         }

//         // Calculate how many new chapters to scrape
//         const chaptersToScrape = novelData.numOfCh - latestChapterNumber;
//         console.log(`Need to scrape ${chaptersToScrape} new chapters.`);

//         // Scrape chapters (only the new ones)
//         // If no chapters exist, scrape all. Otherwise, scrape only new chapters
//         const scrapedChapters = await scrapeChapters(page, novelData.numOfCh, latestChapterNumber);
//         console.log(`Total new chapters scraped: ${scrapedChapters.length}`);

//         // Store new chapters in database
//         if (scrapedChapters.length > 0) {
//             const newChaptersCount = await insertChapters(novelId, scrapedChapters);
//             console.log(`${newChaptersCount} new chapters stored in database with Novel ID: ${novelId}`);
//         } else {
//             console.log("No new chapters to store.");
//         }

//     } catch (error) {
//         console.error("Error during scraping:", error);
//     } finally {
//         // Close browser when done
//         await browser.close();
//         // Close database connection
//         await closeDbConnection();
//         console.log("Scraping process completed");
//     }
// }

// // Execute the main function
// main().catch(console.error);

// main.js
const { launchBrowser } = require("./browser");
const { scrapeNovelDetails, scrapeChapters } = require("./scraper");
const { 
  insertNovel, 
  insertChapters, 
  checkNovelExists,
  getLatestChapterNumber,
  closeDbConnection
} = require("./DatabaseOperations");

// Main execution function
async function main() {

    const urls = [
        
  
  "https://www.mvlempyr.com/novel/dimension-weaver-my-wife-is-the-dragon-empress",
  "https://www.mvlempyr.com/novel/dimensional-descent",
  "https://www.mvlempyr.com/novel/dimensional-keeper-all-my-skills-are-at-level-100",
  "https://www.mvlempyr.com/novel/dimensional-sovereign",
  "https://www.mvlempyr.com/novel/discordant-note-the-beginning-after-the-end-si",
  "https://www.mvlempyr.com/novel/divine-convenience-store",
  "https://www.mvlempyr.com/novel/divine-doctor-daughter-of-the-first-wife",
  "https://www.mvlempyr.com/novel/divine-doctor-dragon-master",
  "https://www.mvlempyr.com/novel/divine-emperor-of-death",
  "https://www.mvlempyr.com/novel/divine-god-against-the-heavens",
  "https://www.mvlempyr.com/novel/divine-harem-my-sect-of-heavenly-beauties",
  "https://www.mvlempyr.com/novel/divine-king-of-honour",
  "https://www.mvlempyr.com/novel/divine-luck-sss-rank-battle-maid-harem",
  "https://www.mvlempyr.com/novel/divine-mask-i-have-numerous-god-clones",
  "https://www.mvlempyr.com/novel/divine-path-system",
  "https://www.mvlempyr.com/novel/divine-protection-of-many-gods",
  "https://www.mvlempyr.com/novel/divine-son-reincarnated-with-a-domination-system",
  "https://www.mvlempyr.com/novel/divine-throne-of-primordial-blood",
  "https://www.mvlempyr.com/novel/divinity-against-the-godly-system",
  "https://www.mvlempyr.com/novel/divorced-and-determined-the-ceos-ex-wife-fights-for-love",
  "https://www.mvlempyr.com/novel/divorced-my-scum-husband-married-his-evil-brother",
  "https://www.mvlempyr.com/novel/does-anyone-actually-believes-that-my-master-is-a-mortal",
  "https://www.mvlempyr.com/novel/dominate-the-super-bowl",
  "https://www.mvlempyr.com/novel/dominating-sword-immortal",
  "https://www.mvlempyr.com/novel/domination-in-america-starting-from-being-a-boxing-champion",
  "https://www.mvlempyr.com/novel/dominion-of-the-beast-masters",
  "https://www.mvlempyr.com/novel/dominions-end",
  "https://www.mvlempyr.com/novel/dont-confiscate-my-identity-as-a-human-race",
  "https://www.mvlempyr.com/novel/dont-pick-up-boyfriends-from-the-trash-bin",
  "https://www.mvlempyr.com/novel/doomed-to-be-cannon-fodder",
  "https://www.mvlempyr.com/novel/doomsday-lord",
  "https://www.mvlempyr.com/novel/douluo-dalu",
  "https://www.mvlempyr.com/novel/douluo-dalu-2-the-true-god-king",
  "https://www.mvlempyr.com/novel/downtown-druid",
  "https://www.mvlempyr.com/novel/draconic-pets-evolution-system",
  "https://www.mvlempyr.com/novel/dragon-blood-warrior",
  "https://www.mvlempyr.com/novel/dragon-genesis-i-can-create-dragons",
  "https://www.mvlempyr.com/novel/dragon-lord-erotic-mmo",
  "https://www.mvlempyr.com/novel/dragon-maken-war",
  "https://www.mvlempyr.com/novel/dragon-marked-war-god",
  "https://www.mvlempyr.com/novel/dragon-master-the-sss-ranked-school-belle-asked-me-to-contract-her",
  "https://www.mvlempyr.com/novel/dragon-monarch-system",
  "https://www.mvlempyr.com/novel/dragons-bloodline",
  "https://www.mvlempyr.com/novel/dragoon",
  "https://www.mvlempyr.com/novel/drop-a-tale-of-the-fragrance-princess-ln",
  "https://www.mvlempyr.com/novel/dual-cultivation",
  "https://www.mvlempyr.com/novel/dual-cultivation-beasts-and-women",
  "https://www.mvlempyr.com/novel/dual-cultivation-god-returns",
  "https://www.mvlempyr.com/novel/dual-cultivator-reborn-system-in-the-cultivation-world",
  "https://www.mvlempyr.com/novel/dual-cultivator-with-a-cultivation-system",
  "https://www.mvlempyr.com/novel/duality-of-shadows",
  "https://www.mvlempyr.com/novel/duke-please-stop-because-it-hurts",
  "https://www.mvlempyr.com/novel/dungeon-battle-royale-since-i-became-a-demon-king-i-will-aim-for-world-domination",
  "https://www.mvlempyr.com/novel/dungeon-defense",
  "https://www.mvlempyr.com/novel/dungeon-defense-wn",
  "https://www.mvlempyr.com/novel/dungeon-diver-stealing-a-monsters-power",
  "https://www.mvlempyr.com/novel/dungeon-hunter",
  "https://www.mvlempyr.com/novel/dungeon-maker",
  "https://www.mvlempyr.com/novel/dungeon-of-niflheim",
  "https://www.mvlempyr.com/novel/dungeon-of-pride-laplace",
  "https://www.mvlempyr.com/novel/dungeon-overlord-monster-girl-harem",
  "https://www.mvlempyr.com/novel/dungeon-raider-system",
  "https://www.mvlempyr.com/novel/duskbound"
      ];

    const browser = await launchBrowser();

    try {
        for (let url of urls) {
            console.log(`Scraping novel from URL: ${url}`);
            const page = await browser.newPage();

            try {
                // Set up the page
                await page.setUserAgent(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                );
                await page.goto(url, { waitUntil: "networkidle2" });

                // // Scrape novel details
                // const novelData = await scrapeNovelDetails(page);
                // console.log("Novel information:", novelData);

                // if (!novelData.title || !novelData.author) {
                //     console.log("Missing essential novel data (title or author). Exiting.");
                //     continue;  // Skip this novel and move to the next one
                // }

                // // Store novel in database or get existing ID
                // const novelId = await insertNovel({
                //     title: novelData.title,
                //     author: novelData.author,
                //     description: novelData.synopsis,
                //     cover_image_url: novelData.imageLink,
                //     tags: novelData.tags,
                //     genres: novelData.genres,
                //     status: novelData.status,
                // });

                // if (!novelId) {
                //     console.log("Failed to process novel data. Skipping.");
                //     continue;  // Skip this novel and move to the next one
                // }

                // // Get latest chapter from DB to determine how many chapters to scrape
                // const latestChapterNumber = await getLatestChapterNumber(novelId);
                // console.log(`Current chapters in database: ${latestChapterNumber}`);
                // console.log(`Total chapters on site: ${novelData.numOfCh}`);

                // if (latestChapterNumber >= novelData.numOfCh) {
                //     console.log("Novel is already up to date. No new chapters to scrape.");
                //     continue;  // Skip this novel and move to the next one
                // }

                // // Calculate how many new chapters to scrape
                // const chaptersToScrape = novelData.numOfCh - latestChapterNumber;
                // console.log(`Need to scrape ${chaptersToScrape} new chapters.`);

                // // Scrape chapters (only the new ones)
                // const scrapedChapters = await scrapeChapters(page, novelData.numOfCh, latestChapterNumber);
                // console.log(`Total new chapters scraped: ${scrapedChapters.length}`);

                // Scrape novel details
        const novelData = await scrapeNovelDetails(page);
        console.log("Novel information:", novelData);

        if (!novelData.title || !novelData.author) {
            console.log("Missing essential novel data (title or author). Exiting.");
            continue;  // Skip this novel and move to the next one
        }

        // Store novel in database or get existing ID
        const novelId = await insertNovel({
            title: novelData.title,
            author: novelData.author,
            description: novelData.synopsis,
            cover_image_url: novelData.imageLink,
            tags: novelData.tags,
            genres: novelData.genres,
            status: novelData.status,
        });

        if (!novelId) {
            console.log("Failed to process novel data. Skipping.");
            continue;  // Skip this novel and move to the next one
        }

        // Get latest chapter from DB to determine how many chapters to scrape
        const latestChapterNumber = await getLatestChapterNumber(novelId);
        
        // Use the most reliable chapter count - prefer numOfCh but fall back to chapters
        // if numOfCh is zero
        const totalChapters = novelData.numOfCh || parseInt(novelData.chapters) || 0;
        
        console.log(`Current chapters in database: ${latestChapterNumber}`);
        console.log(`Total chapters on site: ${totalChapters}`);

        if (latestChapterNumber >= totalChapters || totalChapters === 0) {
            console.log("Novel is already up to date or no chapters found. Skipping.");
            continue;  // Skip this novel and move to the next one
        }

        // Calculate how many new chapters to scrape
        const chaptersToScrape = totalChapters - latestChapterNumber;
        console.log(`Need to scrape ${chaptersToScrape} new chapters.`);

        // Scrape chapters (only the new ones)
        const scrapedChapters = await scrapeChapters(page, totalChapters, latestChapterNumber);
        console.log(`Total new chapters scraped: ${scrapedChapters.length}`);

                // Store new chapters in database
                if (scrapedChapters.length > 0) {
                    const newChaptersCount = await insertChapters(novelId, scrapedChapters);
                    console.log(`${newChaptersCount} new chapters stored in database with Novel ID: ${novelId}`);
                } else {
                    console.log("No new chapters to store.");
                }

            } catch (error) {
                console.error(`Error during scraping URL: ${url}`, error);
            } finally {
                // Close the page after scraping
                await page.close();
            }
        }

    } catch (error) {
        console.error("Error during scraping process:", error);
    } finally {
        // Close browser when done
        await browser.close();
        // Close database connection
        await closeDbConnection();
        console.log("Scraping process completed");
    }
}

// Execute the main function
main().catch(console.error);
