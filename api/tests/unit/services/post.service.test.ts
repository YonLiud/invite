import { PostService } from "../../../src/services/PostService";
import { clearTestDatabase } from "../../utils/test-helpers";

describe('PostService', () => {
  let postService: PostService;

  beforeAll(() => {
    postService = new PostService();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

});