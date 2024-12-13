-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "isSponsored" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "title" SET DEFAULT '',
ALTER COLUMN "subtitle" DROP NOT NULL,
ALTER COLUMN "subtitle" SET DEFAULT '';

-- CreateTable
CREATE TABLE "SponsoredArticle" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SponsoredArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SponsoredArticle_articleId_key" ON "SponsoredArticle"("articleId");

-- AddForeignKey
ALTER TABLE "SponsoredArticle" ADD CONSTRAINT "SponsoredArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsoredArticle" ADD CONSTRAINT "SponsoredArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
