const ytUrl = 'https://youtube-video-fast-downloader-24-7.p.rapidapi.com/download_video/T5OlEM7pfC4?quality=720';
const pinUrl = 'https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest?url=https%3A%2F%2Fin.pinterest.com%2Fpin%2F1095852521805152932%2F';
const key = '09357daa53msh84462b75a2a177ep170dfbjsnd5286fc0955f';

async function run() {
  try {
    const ytRes = await fetch(ytUrl, {
      headers: {
        'x-rapidapi-host': 'youtube-video-fast-downloader-24-7.p.rapidapi.com',
        'x-rapidapi-key': key
      }
    });
    console.log("YT Video Code:", ytRes.status);
    console.log("YT Video:", await ytRes.text());
  } catch(e) {}

  try {
    const pinRes = await fetch(pinUrl, {
      headers: {
        'x-rapidapi-host': 'pinterest-video-and-image-downloader.p.rapidapi.com',
        'x-rapidapi-key': key
      }
    });
    console.log("PIN Code:", pinRes.status);
    console.log("PIN:", await pinRes.text());
  } catch(e) {}
}
run();
