import { Given } from 'cypress-cucumber-preprocessor/steps';
import { GoogleSearchPage } from '../PageObjects/GoogleSearchPage';

const url = 'https://google.com';
Given('I open Google page', () => {
  GoogleSearchPage.visit(url);
});
