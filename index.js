import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
import path from "path";

// 🧹 Xóa toàn bộ lock file phổ biến của Git
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


const dataPath = "./data.json";
const getRandomInt = (min, max) => Math.floor(crypto.randomInt(min, max + 1));

// Tạo ngày ngẫu nhiên
const getRandomDate = () => {
    const start = new Date("2020-01-01").getTime();
    const end = new Date().getTime();
    return new Date(getRandomInt(start, end));
};

// Ghi file và commit
const markCommit = (date) => {
    const isoDate = date.toISOString();
    fs.writeFileSync(dataPath, JSON.stringify({ date: isoDate }));
    execSync(`git add ${dataPath}`);
    execSync(`git commit -m "${isoDate}" --date="${isoDate}" --quiet`);
};

const makeCommits = (n) => {
    console.log(`🛠️  Bắt đầu tạo ${n} commit...`);
    for (let i = 0; i < n; i++) {
        const date = getRandomDate();
        markCommit(date);
        if ((i + 1) % 1000 === 0) console.log(`✅ Đã tạo ${i + 1} commit...`);
    }

    console.log("🚀 Push toàn bộ commit lên remote...");
    execSync("git push", { stdio: "inherit" });

    console.log("🎉 Hoàn tất!");
};

makeCommits(50000);
