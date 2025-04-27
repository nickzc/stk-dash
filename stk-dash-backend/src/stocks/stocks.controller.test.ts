import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { BadRequestException } from '@nestjs/common';

describe('StocksController', () => {
  let controller: StocksController;
  let stocksService: StocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers: [
        {
          provide: StocksService,
          useValue: {
            getDefaultStocksQuotes: jest.fn(),
            getStockDetail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StocksController>(StocksController);
    stocksService = module.get<StocksService>(StocksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStockDetail', () => {
    it('should throw BadRequestException when symbol is undefined', async () => {
      // Call the controller method with undefined symbol
      try {
        await controller.getStockDetail(undefined as any);
        // If we reach here, the test should fail
        fail('Expected BadRequestException was not thrown');
      } catch (error) {
        // Check if the error is a BadRequestException
        expect(error).toBeInstanceOf(BadRequestException);

        // Check if the error response has the expected structure and message
        const errorResponse = error.getResponse();
        expect(errorResponse).toEqual({
          success: false,
          message: 'Invalid stock symbol',
          error: 'Stock symbol is required and must be a string',
        });
      }
    });

    it('should throw BadRequestException when symbol is not a string', async () => {
      // Call the controller method with a non-string symbol (number in this case)
      try {
        await controller.getStockDetail(123 as any);
        fail('Expected BadRequestException was not thrown');
      } catch (error) {
        // Check if the error is a BadRequestException
        expect(error).toBeInstanceOf(BadRequestException);

        // Check if the error response has the expected structure and message
        const errorResponse = error.getResponse();
        expect(errorResponse).toEqual({
          success: false,
          message: 'Invalid stock symbol',
          error: 'Stock symbol is required and must be a string',
        });
      }
    });

    it('should call stocksService.getStockDetail with valid symbol', async () => {
      // Mock successful response from service
      const mockStockDetail = {
        symbol: 'AAPL',
        name: 'Apple Inc.',
      };

      jest
        .spyOn(stocksService, 'getStockDetail')
        .mockResolvedValue(mockStockDetail);

      // Call the controller method with a valid symbol
      const result = await controller.getStockDetail('AAPL');

      // Verify service was called with correct parameter
      expect(stocksService.getStockDetail).toHaveBeenCalledWith('AAPL');

      // Verify response structure
      expect(result).toEqual({
        success: true,
        data: mockStockDetail,
      });
    });
  });
});
