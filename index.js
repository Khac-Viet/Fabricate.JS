import fs from "fs";
import path from "path";
import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import crypto from "crypto";

const dataPath = "./data.json";
const git = simpleGit();

// 🧹 Tự động xóa các lock file của Git
const lockFiles = [
    ".git/index.lock",
    ".git/HEAD.lock",
    ".git/refs/heads/main.lock",
    ".git/logs/HEAD.lock"
];

lockFiles.forEach((lockPath) => {
    const fullPath = path.resolve(lockPath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`🧹 Đã xoá lock file: ${lockPath}`);
    }
});

const getRandomInt = (min, max) => Math.floor(crypto.randomInt(min, max + 1));

const isValidDate = (date) => {
    const startDate = moment("2020-01-01");
    const endDate = moment();
    return date.isBetween(startDate, endDate, null, "[]");
};

const markCommit = async (date) => {
    const data = { date: date.toISOString() };
    await jsonfile.writeFile(dataPath, data);

    await git.add([dataPath]);
    await git.commit(date.toISOString(), {
        "--date": date.toISOString(),
        "--quiet": null,
    });
};

const makeCommits = async (n) => {
    console.log(`🛠️  Bắt đầu tạo ${n} commit...`);

    for (let i = 0; i < n; i++) {
        const randomWeeks = getRandomInt(0, 58);
        const randomDays = getRandomInt(0, 6);
        const randomDate = moment("2020-01-01")
            .add(randomWeeks, "weeks")
            .add(randomDays, "days");

        if (isValidDate(randomDate)) {
            try {
                await markCommit(randomDate);
                if ((i + 1) % 100 === 0) {
                    console.log(`✅ Đã tạo ${i + 1} commit`);
                }
            } catch (err) {
                console.error(`❌ Lỗi khi commit ${randomDate.toISOString()}:`, err.message);
            }
        }
    }

    console.log("📤 Pushing all commits...");
    await git.push();
};

makeCommits(50000);
