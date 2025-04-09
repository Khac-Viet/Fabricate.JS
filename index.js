import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const dataPath = "./data.json";

const getRandomInt = (min, max) => Math.floor(crypto.randomInt(min, max + 1));

// Trả về ngày ngẫu nhiên trong khoảng từ 2020-01-01 đến hiện tại
const getRandomDate = () => {
    const start = new Date("2020-01-01").getTime();
    const end = new Date().getTime();
    const randomTime = getRandomInt(start, end);
    return new Date(randomTime);
};

// Ghi file và tạo commit với ngày cụ thể
const markCommit = (date) => {
    const isoDate = date.toISOString();

    // Ghi file JSON
    fs.writeFileSync(dataPath, JSON.stringify({ date: isoDate }));

    // Thêm và commit bằng git CLI
    execSync(`git add ${dataPath}`);
    execSync(`git commit -m "${isoDate}" --date="${isoDate}" --quiet`);
};

// Chạy quá trình tạo commit
const makeCommits = (n) => {
    console.log(`🛠️  Bắt đầu tạo ${n} commit...`);

    for (let i = 0; i < n; i++) {
        const date = getRandomDate();
        markCommit(date);

        if ((i + 1) % 1000 === 0) {
            console.log(`✅ Đã tạo ${i + 1} commit...`);
        }
    }

    console.log("🚀 Push toàn bộ commit lên remote...");
    execSync("git push", { stdio: "inherit" });

    console.log("🎉 Hoàn tất!");
};

// Gọi hàm tạo 50,000 commit
makeCommits(50000);
