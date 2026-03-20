async function test() {
  const url = 'https://translate.google.com/translate_tts?ie=UTF-8&q=hello&tl=yo&client=t';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://translate.google.com/'
    }
  });
  console.log(`Status: ${res.status}`);
}
test();
