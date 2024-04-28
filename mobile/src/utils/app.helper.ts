import { PlayUrl } from '../interface/match.interface';

export const objectToQueryString = (obj: any, prefix?: any): any => {
  const str = [];

  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + '[' + p + ']' : p;
      const v = obj[p];
      str.push(
        v !== null && typeof v === 'object'
          ? objectToQueryString(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      );
    }
  }
  return str.join('&');
};

export const getVideoUrl = (data: PlayUrl[]): string => {
  const fullHd = data.find((element) => element.name === 'FHD');
  if (fullHd !== undefined) {
    return fullHd.url;
  }
  const fullHd1 = data.find((element) => element.name === 'FullHD');
  if (fullHd1 !== undefined) {
    return fullHd1.url;
  }
  const hD = data.find((element) => element.name === 'HD');
  if (hD !== undefined) {
    return hD.url;
  }
  return data[0].url;
};
