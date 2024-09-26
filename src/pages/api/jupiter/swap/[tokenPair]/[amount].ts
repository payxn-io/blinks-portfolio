import { NextApiRequest, NextApiResponse } from 'next';
import jupiterApi from '../../../../api/jupiter-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tokenPair, amount } = req.query;

  const [inputToken, outputToken] = (tokenPair as string).split('-');

  const [inputTokenMeta, outputTokenMeta] = await Promise.all([
    jupiterApi.lookupToken(inputToken),
    jupiterApi.lookupToken(outputToken),
  ]);

  if (!inputTokenMeta || !outputTokenMeta) {
    return res.status(422).json({ message: `Token metadata not found.` });
  }

  const tokenUsdPrices = await jupiterApi.getTokenPricesInUsdc([inputTokenMeta.address]);
  const tokenPriceUsd = tokenUsdPrices[inputTokenMeta.address];

  if (!tokenPriceUsd) {
    return res.status(422).json({ message: `Failed to get price for ${inputTokenMeta.symbol}.` });
  }

  const tokenAmount = parseFloat(amount as string) / tokenPriceUsd.price;
  const tokenAmountFractional = Math.ceil(tokenAmount * 10 ** inputTokenMeta.decimals);

  const quote = await jupiterApi.quoteGet({
    inputMint: inputTokenMeta.address,
    outputMint: outputTokenMeta.address,
    amount: tokenAmountFractional,
    autoSlippage: true,
    maxAutoSlippageBps: 500, // 5%
  });

  const swapResponse = await jupiterApi.swapPost({
    swapRequest: {
      quoteResponse: quote,
      userPublicKey: '', // Get from user session or input
      prioritizationFeeLamports: 'auto',
    },
  });

  res.status(200).json({ transaction: swapResponse.swapTransaction });
}
