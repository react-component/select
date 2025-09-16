import React from 'react';
import Select from '@rc-component/select';
import '../../assets/index.less';

const incidencesStateResource = [
  { value: 4, label: 'Not Identified' },
  { value: 3, label: 'Closed' },
  { value: 2, label: 'Communicated' },
  { value: 6, label: 'Identified' },
  { value: 1, label: 'Resolved' },
  { value: 5, label: 'Cancelled' },
];

const countries = [
  {
    id: 'AF',
    en: 'Afghanistan',
  },
  {
    id: 'AX',
    en: 'Åland Islands',
  },
  {
    id: 'AL',
    en: 'Albania',
  },
  {
    id: 'DZ',
    en: 'Algeria',
  },
  {
    id: 'AS',
    en: 'American Samoa',
  },
  {
    id: 'AD',
    en: 'Andorra',
  },
  {
    id: 'AO',
    en: 'Angola',
  },
  {
    id: 'AI',
    en: 'Anguilla',
  },
  {
    id: 'AG',
    en: 'Antigua & Barbuda',
  },
  {
    id: 'AR',
    en: 'Argentina',
  },
  {
    id: 'AM',
    en: 'Armenia',
  },
  {
    id: 'AW',
    en: 'Aruba',
  },
  {
    id: 'AU',
    en: 'Australia',
  },
  {
    id: 'AT',
    en: 'Austria',
  },
  {
    id: 'AZ',
    en: 'Azerbaijan',
  },
  {
    id: 'BS',
    en: 'Bahamas',
  },
  {
    id: 'BH',
    en: 'Bahrain',
  },
  {
    id: 'BD',
    en: 'Bangladesh',
  },
  {
    id: 'BB',
    en: 'Barbados',
  },
  {
    id: 'BY',
    en: 'Belarus',
  },
  {
    id: 'BE',
    en: 'Belgium',
  },
  {
    id: 'BZ',
    en: 'Belize',
  },
  {
    id: 'BJ',
    en: 'Benin',
  },
  {
    id: 'BM',
    en: 'Bermuda',
  },
  {
    id: 'BT',
    en: 'Bhutan',
  },
  {
    id: 'BO',
    en: 'Bolivia',
  },
  {
    id: 'BA',
    en: 'Bosnia & Herzegovina',
  },
  {
    id: 'BW',
    en: 'Botswana',
  },
  {
    id: 'BR',
    en: 'Brazil',
  },
  {
    id: 'IO',
    en: 'British Indian Ocean Territory',
  },
  {
    id: 'VG',
    en: 'British Virgin Islands',
  },
  {
    id: 'BN',
    en: 'Brunei',
  },
  {
    id: 'BG',
    en: 'Bulgaria',
  },
  {
    id: 'BF',
    en: 'Burkina Faso',
  },
  {
    id: 'BI',
    en: 'Burundi',
  },
  {
    id: 'KH',
    en: 'Cambodia',
  },
  {
    id: 'CM',
    en: 'Cameroon',
  },
  {
    id: 'CA',
    en: 'Canada',
  },
  {
    id: 'CV',
    en: 'Cape Verde',
  },
  {
    id: 'KY',
    en: 'Cayman Islands',
  },
  {
    id: 'CF',
    en: 'Central African Republic',
  },
  {
    id: 'TD',
    en: 'Chad',
  },
  {
    id: 'CL',
    en: 'Chile',
  },
  {
    id: 'CX',
    en: 'Christmas Island',
  },
  {
    id: 'CC',
    en: 'Cocos (Keeling) Islands',
  },
  {
    id: 'CO',
    en: 'Colombia',
  },
  {
    id: 'KM',
    en: 'Comoros',
  },
  {
    id: 'CG',
    en: 'Congo - Brazzaville',
  },
  {
    id: 'CD',
    en: 'Congo - Kinshasa',
  },
  {
    id: 'CK',
    en: 'Cook Islands',
  },
  {
    id: 'CR',
    en: 'Costa Rica',
  },
  {
    id: 'CI',
    en: 'Côte d’Ivoire',
  },
  {
    id: 'HR',
    en: 'Croatia',
  },
  {
    id: 'CU',
    en: 'Cuba',
  },
  {
    id: 'CW',
    en: 'Curaçao',
  },
  {
    id: 'CY',
    en: 'Cyprus',
  },
  {
    id: 'CZ',
    en: 'Czech Republic',
  },
  {
    id: 'DK',
    en: 'Denmark',
  },
  {
    id: 'DJ',
    en: 'Djibouti',
  },
  {
    id: 'DM',
    en: 'Dominica',
  },
  {
    id: 'DO',
    en: 'Dominican Republic',
  },
  {
    id: 'EC',
    en: 'Ecuador',
  },
  {
    id: 'EG',
    en: 'Egypt',
  },
  {
    id: 'SV',
    en: 'El Salvador',
  },
  {
    id: 'GQ',
    en: 'Equatorial Guinea',
  },
  {
    id: 'ER',
    en: 'Eritrea',
  },
  {
    id: 'EE',
    en: 'Estonia',
  },
  {
    id: 'ET',
    en: 'Ethiopia',
  },
  {
    id: 'FK',
    en: 'Falkland Islands',
  },
  {
    id: 'FO',
    en: 'Faroe Islands',
  },
  {
    id: 'FJ',
    en: 'Fiji',
  },
  {
    id: 'FI',
    en: 'Finland',
  },
  {
    id: 'FR',
    en: 'France',
  },
  {
    id: 'GF',
    en: 'French Guiana',
  },
  {
    id: 'PF',
    en: 'French Polynesia',
  },
  {
    id: 'GA',
    en: 'Gabon',
  },
  {
    id: 'GM',
    en: 'Gambia',
  },
  {
    id: 'GE',
    en: 'Georgia',
  },
  {
    id: 'DE',
    en: 'Germany',
  },
  {
    id: 'GH',
    en: 'Ghana',
  },
  {
    id: 'GI',
    en: 'Gibraltar',
  },
  {
    id: 'GR',
    en: 'Greece',
  },
  {
    id: 'GL',
    en: 'Greenland',
  },
  {
    id: 'GD',
    en: 'Grenada',
  },
  {
    id: 'GP',
    en: 'Guadeloupe',
  },
  {
    id: 'GU',
    en: 'Guam',
  },
  {
    id: 'GT',
    en: 'Guatemala',
  },
  {
    id: 'GG',
    en: 'Guernsey',
  },
  {
    id: 'GN',
    en: 'Guinea',
  },
  {
    id: 'GW',
    en: 'Guinea-Bissau',
  },
  {
    id: 'GY',
    en: 'Guyana',
  },
  {
    id: 'HT',
    en: 'Haiti',
  },
  {
    id: 'HN',
    en: 'Honduras',
  },
  {
    id: 'HU',
    en: 'Hungary',
  },
  {
    id: 'IS',
    en: 'Iceland',
  },
  {
    id: 'IN',
    en: 'India',
  },
  {
    id: 'ID',
    en: 'Indonesia',
  },
  {
    id: 'IR',
    en: 'Iran',
  },
  {
    id: 'IQ',
    en: 'Iraq',
  },
  {
    id: 'IE',
    en: 'Ireland',
  },
  {
    id: 'IM',
    en: 'Isle of Man',
  },
  {
    id: 'IL',
    en: 'Israel',
  },
  {
    id: 'IT',
    en: 'Italy',
  },
  {
    id: 'JM',
    en: 'Jamaica',
  },
  {
    id: 'JP',
    en: 'Japan',
  },
  {
    id: 'JE',
    en: 'Jersey',
  },
  {
    id: 'JO',
    en: 'Jordan',
  },
  {
    id: 'KZ',
    en: 'Kazakhstan',
  },
  {
    id: 'KE',
    en: 'Kenya',
  },
  {
    id: 'KI',
    en: 'Kiribati',
  },
  {
    id: 'XK',
    en: 'Kosovo',
  },
  {
    id: 'KW',
    en: 'Kuwait',
  },
  {
    id: 'KG',
    en: 'Kyrgyzstan',
  },
  {
    id: 'LA',
    en: 'Laos',
  },
  {
    id: 'LV',
    en: 'Latvia',
  },
  {
    id: 'LB',
    en: 'Lebanon',
  },
  {
    id: 'LS',
    en: 'Lesotho',
  },
  {
    id: 'LR',
    en: 'Liberia',
  },
  {
    id: 'LY',
    en: 'Libya',
  },
  {
    id: 'LI',
    en: 'Liechtenstein',
  },
  {
    id: 'LT',
    en: 'Lithuania',
  },
  {
    id: 'LU',
    en: 'Luxembourg',
  },
  {
    id: 'MK',
    en: 'Macedonia',
  },
  {
    id: 'MG',
    en: 'Madagascar',
  },
  {
    id: 'MW',
    en: 'Malawi',
  },
  {
    id: 'MY',
    en: 'Malaysia',
  },
  {
    id: 'MV',
    en: 'Maldives',
  },
  {
    id: 'ML',
    en: 'Mali',
  },
  {
    id: 'MT',
    en: 'Malta',
  },
  {
    id: 'MH',
    en: 'Marshall Islands',
  },
  {
    id: 'MQ',
    en: 'Martinique',
  },
  {
    id: 'MR',
    en: 'Mauritania',
  },
  {
    id: 'MU',
    en: 'Mauritius',
  },
  {
    id: 'YT',
    en: 'Mayotte',
  },
  {
    id: 'MX',
    en: 'Mexico',
  },
  {
    id: 'FM',
    en: 'Micronesia',
  },
  {
    id: 'MD',
    en: 'Moldova',
  },
  {
    id: 'MC',
    en: 'Monaco',
  },
  {
    id: 'MN',
    en: 'Mongolia',
  },
  {
    id: 'ME',
    en: 'Montenegro',
  },
  {
    id: 'MS',
    en: 'Montserrat',
  },
  {
    id: 'MA',
    en: 'Morocco',
  },
  {
    id: 'MZ',
    en: 'Mozambique',
  },
  {
    id: 'MM',
    en: 'Myanmar (Burma)',
  },
  {
    id: 'NA',
    en: 'Namibia',
  },
  {
    id: 'NR',
    en: 'Nauru',
  },
  {
    id: 'NP',
    en: 'Nepal',
  },
  {
    id: 'NL',
    en: 'Netherlands',
  },
  {
    id: 'NC',
    en: 'New Caledonia',
  },
  {
    id: 'NZ',
    en: 'New Zealand',
  },
  {
    id: 'NI',
    en: 'Nicaragua',
  },
  {
    id: 'NE',
    en: 'Niger',
  },
  {
    id: 'NG',
    en: 'Nigeria',
  },
  {
    id: 'NU',
    en: 'Niue',
  },
  {
    id: 'NF',
    en: 'Norfolk Island',
  },
  {
    id: 'KP',
    en: 'North Korea',
  },
  {
    id: 'MP',
    en: 'Northern Mariana Islands',
  },
  {
    id: 'NO',
    en: 'Norway',
  },
  {
    id: 'OM',
    en: 'Oman',
  },
  {
    id: 'PK',
    en: 'Pakistan',
  },
  {
    id: 'PW',
    en: 'Palau',
  },
  {
    id: 'PS',
    en: 'Palestinian Territories',
  },
  {
    id: 'PA',
    en: 'Panama',
  },
  {
    id: 'PG',
    en: 'Papua New Guinea',
  },
  {
    id: 'PY',
    en: 'Paraguay',
  },
  {
    id: 'PE',
    en: 'Peru',
  },
  {
    id: 'PH',
    en: 'Philippines',
  },
  {
    id: 'PN',
    en: 'Pitcairn Islands',
  },
  {
    id: 'PL',
    en: 'Poland',
  },
  {
    id: 'PT',
    en: 'Portugal',
  },
  {
    id: 'PR',
    en: 'Puerto Rico',
  },
  {
    id: 'QA',
    en: 'Qatar',
  },
  {
    id: 'RE',
    en: 'Réunion',
  },
  {
    id: 'RO',
    en: 'Romania',
  },
  {
    id: 'RU',
    en: 'Russia',
  },
  {
    id: 'RW',
    en: 'Rwanda',
  },
  {
    id: 'WS',
    en: 'Samoa',
  },
  {
    id: 'SM',
    en: 'San Marino',
  },
  {
    id: 'ST',
    en: 'São Tomé & Príncipe',
  },
  {
    id: 'SA',
    en: 'Saudi Arabia',
  },
  {
    id: 'SN',
    en: 'Senegal',
  },
  {
    id: 'RS',
    en: 'Serbia',
  },
  {
    id: 'SC',
    en: 'Seychelles',
  },
  {
    id: 'SL',
    en: 'Sierra Leone',
  },
  {
    id: 'SG',
    en: 'Singapore',
  },
  {
    id: 'SX',
    en: 'Sint Maarten',
  },
  {
    id: 'SK',
    en: 'Slovakia',
  },
  {
    id: 'SI',
    en: 'Slovenia',
  },
  {
    id: 'SB',
    en: 'Solomon Islands',
  },
  {
    id: 'SO',
    en: 'Somalia',
  },
  {
    id: 'ZA',
    en: 'South Africa',
  },
  {
    id: 'GS',
    en: 'South Georgia & South Sandwich I',
  },
  {
    id: 'KR',
    en: 'South Korea',
  },
  {
    id: 'SS',
    en: 'South Sudan',
  },
  {
    id: 'ES',
    en: 'Spain',
  },
  {
    id: 'LK',
    en: 'Sri Lanka',
  },
  {
    id: 'BL',
    en: 'St. Barthélemy',
  },
  {
    id: 'KN',
    en: 'St. Kitts & Nevis',
  },
  {
    id: 'LC',
    en: 'St. Lucia',
  },
  {
    id: 'MF',
    en: 'St. Martin',
  },
  {
    id: 'PM',
    en: 'St. Pierre & Miquelon',
  },
  {
    id: 'VC',
    en: 'St. Vincent & Grenadines',
  },
  {
    id: 'SD',
    en: 'Sudan',
  },
  {
    id: 'SR',
    en: 'Suriname',
  },
  {
    id: 'SJ',
    en: 'Svalbard & Jan Mayen',
  },
  {
    id: 'SZ',
    en: 'Swaziland',
  },
  {
    id: 'SE',
    en: 'Sweden',
  },
  {
    id: 'CH',
    en: 'Switzerland',
  },
  {
    id: 'SY',
    en: 'Syria',
  },
  {
    id: 'TJ',
    en: 'Tajikistan',
  },
  {
    id: 'TZ',
    en: 'Tanzania',
  },
  {
    id: 'TH',
    en: 'Thailand',
  },
  {
    id: 'TL',
    en: 'Timor-Leste',
  },
  {
    id: 'TG',
    en: 'Togo',
  },
  {
    id: 'TK',
    en: 'Tokelau',
  },
  {
    id: 'TO',
    en: 'Tonga',
  },
  {
    id: 'TT',
    en: 'Trinidad & Tobago',
  },
  {
    id: 'TN',
    en: 'Tunisia',
  },
  {
    id: 'TR',
    en: 'Turkey',
  },
  {
    id: 'TM',
    en: 'Turkmenistan',
  },
  {
    id: 'TC',
    en: 'Turks & Caicos Islands',
  },
  {
    id: 'TV',
    en: 'Tuvalu',
  },
  {
    id: 'VI',
    en: 'U.S. Virgin Islands',
  },
  {
    id: 'UG',
    en: 'Uganda',
  },
  {
    id: 'UA',
    en: 'Ukraine',
  },
  {
    id: 'AE',
    en: 'United Arab Emirates',
  },
  {
    id: 'GB',
    en: 'United Kingdom',
  },
  {
    id: 'US',
    en: 'United States',
  },
  {
    id: 'UY',
    en: 'Uruguay',
  },
  {
    id: 'UZ',
    en: 'Uzbekistan',
  },
  {
    id: 'VU',
    en: 'Vanuatu',
  },
  {
    id: 'VA',
    en: 'Vatican City',
  },
  {
    id: 'VE',
    en: 'Venezuela',
  },
  {
    id: 'VN',
    en: 'Vietnam',
  },
  {
    id: 'WF',
    en: 'Wallis & Futuna',
  },
  {
    id: 'EH',
    en: 'Western Sahara',
  },
  {
    id: 'YE',
    en: 'Yemen',
  },
  {
    id: 'ZM',
    en: 'Zambia',
  },
  {
    id: 'ZW',
    en: 'Zimbabwe',
  },
  {
    id: 'CN',
    en: 'China',
  },
  {
    id: 'HK',
    en: 'Hong Kong SAR China',
  },
  {
    id: 'MO',
    en: 'Macau SAR China',
  },
  {
    id: 'TW',
    en: 'Taiwan',
  },
].map((item) => {
  return {
    value: item.id,
    label: item.en,
  };
});

const sorterByLabel = (optionA, optionB) => optionA.label.localeCompare(optionB.label);

const sorterBySearchValue = (oa, ob, info) =>
  info.searchValue
    ? oa.label.toLowerCase().indexOf(info.searchValue) >
      ob.label.toLowerCase().indexOf(info.searchValue)
      ? 1
      : -1
    : oa.label.localeCompare(ob.label);

const Test = () => (
  <div>
    <h3> with filter sort </h3>
    <Select
      showSearch
      style={{ width: 500 }}
      filterSort={sorterByLabel}
      optionFilterProp="label"
      options={incidencesStateResource}
    />
    <h3> without filter sort </h3>
    <Select
      showSearch
      style={{ width: 500 }}
      optionFilterProp="label"
      options={incidencesStateResource}
    />
    <h3> huge data with filter sort and search value </h3>
    <Select
      showSearch
      style={{ width: 500 }}
      filterSort={sorterBySearchValue}
      optionFilterProp="label"
      options={countries}
    />
  </div>
);

export default Test;
