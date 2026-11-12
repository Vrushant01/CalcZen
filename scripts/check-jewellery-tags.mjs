import fs from 'fs';

const files = [
  'src/calculators/SilverJewelleryBillCalculator.tsx',
  'src/calculators/JewelleryBudgetToWeightCalculator.tsx',
  'src/calculators/GoldLoanAgainstJewelleryCalculator.tsx',
  'src/calculators/DiamondJewelleryPriceCalculator.tsx',
  'src/calculators/OldGoldExchangeValueCalculator.tsx',
  'src/calculators/GoldPurityKaratConverter.tsx',
  'src/calculators/GoldMakingChargesCalculator.tsx',
  'src/calculators/GoldJewelleryBillCalculator.tsx',
];

// First, fix OldGoldExchangeValueCalculator
let oldGold = fs.readFileSync('src/calculators/OldGoldExchangeValueCalculator.tsx', 'utf8');
const search = `                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyResultPlaceholder
            message="Ready to calculate old gold exchange value"
            subMessage="Enter your old gold weight, purity, and jeweller rate, then press Calculate Old Gold Value."
          />
        )}
        </div>
      </div>
    </CalculatorPageLayout>`.replace(/\r?\n/g, '\r\n');

const replace = `                </div>
              </div>
            </div>
            </div>
          </>
        ) : (
          <EmptyResultPlaceholder
            message="Ready to calculate old gold exchange value"
            subMessage="Enter your old gold weight, purity, and jeweller rate, then press Calculate Old Gold Value."
          />
        )}
        </div>
        </div>
      </div>
    </CalculatorPageLayout>`.replace(/\r?\n/g, '\r\n');

if (oldGold.includes(search)) {
  oldGold = oldGold.replace(search, replace);
  fs.writeFileSync('src/calculators/OldGoldExchangeValueCalculator.tsx', oldGold, 'utf8');
  console.log('Fixed OldGold tags');
} else {
  console.log('Could not find search in OldGold');
}

