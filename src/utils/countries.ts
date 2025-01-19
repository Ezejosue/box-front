export interface Country {
  name: string;
  code: string;
  prefix: string;
  flag: string;
}

export const countries: Country[] = [
  {
    name: 'El Salvador',
    code: 'SV',
    prefix: '+503',
    flag: 'https://flagsapi.com/SV/flat/64.png'
  },
  {
    name: 'Guatemala',
    code: 'GT',
    prefix: '+502',
    flag: 'https://flagsapi.com/GT/flat/64.png'
  },
  {
    name: 'Honduras',
    code: 'HN',
    prefix: '+504',
    flag: 'https://flagsapi.com/HN/flat/64.png'
  }
];
