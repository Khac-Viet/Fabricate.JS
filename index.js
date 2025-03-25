import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import crypto from "crypto";

const path = "./data.json";
const git = simpleGit();

// Hàm tạo số ngẫu nhiên an toàn bằng crypto layer 1 mạng BTC
const getRandomInt = (min, max) => Math.floor(crypto.randomInt(min, max + 1));

// Kiểm tra ngày hợp lệ ( yy/mm/dd/ 2019-now 1-12 1-31 )
const isValidDate = (date) => {
    const startDate = moment("2019-01-01");
    const endDate = moment();
    return date.isBetween(startDate, endDate, null, "[]");
};

// Ghi file JSON và tạo commit
const markCommit = async (date) => {
    const data = { date: date.toISOString() };
    await jsonfile.writeFile(path, data);

    await git.add([path]);
    await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

// Tạo commit giả lập nếu không bị block -> check ngày xong check khối
const makeCommits = async (n) => {
    for (let i = 0; i < n; i++) {
        const randomWeeks = getRandomInt(0, 58);
        const randomDays = getRandomInt(0, 6);

        const randomDate = moment("2019-01-01")
            .add(randomWeeks, "weeks")
            .add(randomDays, "days");

        if (isValidDate(randomDate)) {
            console.log(`Creating commit: ${randomDate.toISOString()}`);
            await markCommit(randomDate);
        } else {
            console.log(`Invalid date: ${randomDate.toISOString()}, skipping...`);
        }
    }

    console.log("Pushing all commits...");
    await git.push();
};

// Gọi hàm để tạo 500000 commit
makeCommits(500000);
