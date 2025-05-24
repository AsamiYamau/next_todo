// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const project = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81b3',
    title: '05.内閣メタバース_2025',
    client: 'カドベヤ',
  },
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81b6',
    title: '03.なぜ日本のアニメはすごいのか',
    client: 'スクゥイード',
  },
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81bb',
    title: '90.RECS_カスタマイズ',
    client: 'ビットセンス',
  },
];

const checkList = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    title: 'リンクが繋がっているか',
    status: true,
  },
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81ab',
    title: 'iosの低電力モード時',
    status: false,
  },
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81ac',
    title: 'タクソノミーページのページネーション',
    status: false,
  },
];

const checkListCat = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81ad',
    title: 'iosチェック',
  },
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81ae',
    title: 'wp',
  },
];

//中間テーブル
const CheckListMiddle = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81af',
    checklist_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81ab',
    checklist_cat_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81ad',
  },
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd51af',
    checklist_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81ac',
    checklist_cat_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81ae',
  },
];


export { users, checkList, project, checkListCat , CheckListMiddle };
