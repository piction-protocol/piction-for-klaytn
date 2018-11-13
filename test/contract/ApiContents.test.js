var PXL = artifacts.require("PXL");
var Council = artifacts.require("Council");
var UserPaybackPool = artifacts.require("UserPaybackPool");
var DepositPool = artifacts.require("DepositPool");
var PxlDistributor = artifacts.require("PxlDistributor");
var Marketer = artifacts.require("Marketer");
var Report = artifacts.require("Report");
var ContentsManager = artifacts.require("ContentsManager");
var FundManager = artifacts.require("FundManager");
var AccountManager = artifacts.require("AccountManager");
var ApiContents = artifacts.require("ApiContents");
const BigNumber = web3.BigNumber;

require("chai")
    .use(require("chai-as-promised"))
    .use(require("chai-bignumber")(BigNumber))
    .should();

contract("ApiContents", function (accounts) {
    const owner = accounts[0];
    const writer = accounts[1];
    const user1 = accounts[2];
    const user2 = accounts[3];

    const decimals = Math.pow(10, 18);
    const initialBalance = new BigNumber(1000000000 * decimals);

    const initialDeposit = new BigNumber(100 * decimals);
    const reportRegistrationFee = new BigNumber(50 * decimals);
    const fundAvailable = true;

    const cdRate = 0.15 * decimals;
    const depositRate = 0.03 * decimals;
    const userPaybackRate = 0.02 * decimals;
    const reportRewardRate = 0.1 * decimals;
    const marketerRate = 0.1 * decimals;

    const createPoolInterval = 86400;
    const airdropAmount = 1000 * decimals;

    const addressZero = "0x0000000000000000000000000000000000000000";

    const record = '{"title": "권짱님의 스트레스!!","genres": "액션, 판타지","synopsis": "요괴가 지니고 있는 능력으로 합법적 무력을 행사하고 사회적 문제를 해결하는 단체, \'연옥학원\'. 빼앗긴 심장과 기억을 되찾기 위해 연옥학원에 들어간 좀비, 블루의 모험이 다시 시작된다! 더욱 파워풀한 액션으로 돌아온 연옥학원, 그 두 번째 이야기!","titleImage": "https://www.battlecomics.co.kr/assets/img-logo-692174dc5a66cb2f8a4eae29823bb2b3de2411381f69a187dca62464c6f603ef.svg","thumbnail": "https://www.battlecomics.co.kr/webtoons/467"}';
    const updateRecord = '{"title": "권짱님의 업그레이드 스트레스!!","genres": "액션, 판타지","synopsis": "요괴가 지니고 있는 능력으로 합법적 무력을 행사하고 사회적 문제를 해결하는 단체, \'연옥학원\'. 빼앗긴 심장과 기억을 되찾기 위해 연옥학원에 들어간 좀비, 블루의 모험이 다시 시작된다! 더욱 파워풀한 액션으로 돌아온 연옥학원, 그 두 번째 이야기!","titleImage": "https://www.battlecomics.co.kr/assets/img-logo-692174dc5a66cb2f8a4eae29823bb2b3de2411381f69a187dca62464c6f603ef.svg","thumbnail": "https://www.battlecomics.co.kr/webtoons/467"}';
    const episode = '{"title": "똥쟁이님의 신발 구매???????","genres": "일상","synopsis": "여기 이 남자를 보시라! 뭘 해도 어그로 가 끌리는 미친 존재감! 낙천적이며 교활하기 까지한 티이모 유저 제인유와 그의 친구들의 좌충우돌 스토리!","titleImage": "https://www.battlecomics.co.kr/assets/img-logo-692174dc5a66cb2f8a4eae29823bb2b3de2411381f69a187dca62464c6f603ef.svg","thumbnail": "https://www.battlecomics.co.kr/webtoons/467"}';
    const updateEpisode = '{"title": "똥쟁이님의 조던 11!!!","genres": "일상","synopsis": "여기 이 남자를 보시라! 뭘 해도 어그로 가 끌리는 미친 존재감! 낙천적이며 교활하기 까지한 티이모 유저 제인유와 그의 친구들의 좌충우돌 스토리!","titleImage": "https://www.battlecomics.co.kr/assets/img-logo-692174dc5a66cb2f8a4eae29823bb2b3de2411381f69a187dca62464c6f603ef.svg","thumbnail": "https://www.battlecomics.co.kr/webtoons/467"}';
    const imageUrl = '{"cuts": "https://www.battlecomics.co.kr/assets/img-logo-692174dc5a66cb2f8a4eae29823bb2b3de2411381f69a187dca62464c6f603ef.svg,https://www.battlecomics.co.kr/webtoons/467"}';

    let token;
    let council;
    let apiContents;
    let content;
    let contentsManager;
    let accountManager;
    let depositPool;

    let toBigNumber = function bigNumberToPaddedBytes32(num) {
        var n = num.toString(16).replace(/^0x/, '');
        while (n.length < 64) {
            n = "0" + n;
        }
        return "0x" + n;
    }

    let toAddress = function bigNumberToPaddedBytes32(num) {
        var n = num.toString(16).replace(/^0x/, '');
        while (n.length < 40) {
            n = "0" + n;
        }
        return "0x" + n;
    }

    before("Deploy contract", async() => {
        token = await PXL.new({from: owner});
        council = await Council.new(token.address, {from: owner});
        userPaybackPool = await UserPaybackPool.new(council.address, createPoolInterval, {from: owner});
        depositPool = await DepositPool.new(council.address, {from: owner});
        distributor = await PxlDistributor.new(council.address, {from: owner});
        marketer = await Marketer.new({from: owner});
        report = await Report.new(council.address, {from: owner});
        contentsManager = await ContentsManager.new(council.address, {from: owner});
        fundManager = await FundManager.new(council.address, {from: owner});
        accountManager = await AccountManager.new(council.address, airdropAmount, {from: owner});
        apiContents = await ApiContents.new(council.address, contentsManager.address, {from:owner});
        pxlDistributor = await PxlDistributor.new(council.address, {from:owner});

        await council.initialValue(
            initialDeposit,
            reportRegistrationFee,
            fundAvailable
        ).should.be.fulfilled;

        await council.initialRate(
            cdRate,
            depositRate,
            userPaybackRate,
            reportRewardRate,
            marketerRate
        ).should.be.fulfilled;

        await council.initialPictionAddress(
            userPaybackPool.address,
            depositPool.address,
            pxlDistributor.address,
            marketer.address,
            report.address
        ).should.be.fulfilled;

        await council.initialManagerAddress(
            contentsManager.address,
            fundManager.address,
            accountManager.address
        ).should.be.fulfilled;

        await council.initialApiAddress(
            apiContents.address,
            apiContents.address,
            apiContents.address
        ).should.be.fulfilled;

        await token.mint(initialBalance, {from:owner}).should.be.fulfilled;
        await token.unlock({from: owner}).should.be.fulfilled;
        await token.transfer(accountManager.address, 1000000 * decimals, {from: owner}).should.be.fulfilled;
    });

    describe("Test api contents.", () => {
        it("Create new account.", async () => {

            let writerBalance = await token.balanceOf.call(writer, {from: writer});
            let user1Balance = await token.balanceOf.call(user1, {from: user1});
            let user2Balance = await token.balanceOf.call(user2, {from: user2});

            writerBalance.should.be.bignumber.equal(0);
            user1Balance.should.be.bignumber.equal(0);
            user2Balance.should.be.bignumber.equal(0);

            await accountManager.createNewAccount(
                "writer",
                "qwer1234",
                "asdfasdfasdfasdf",
                writer,
                {from: writer}
            ).should.be.fulfilled;

            await accountManager.createNewAccount(
                "user1",
                "qwer1234",
                "asdfasdfasdfasdf",
                user1,
                {from: user1}
            ).should.be.fulfilled;

            await accountManager.createNewAccount(
                "user2",
                "qwer1234",
                "asdfasdfasdfasdf",
                user2,
                {from: user2}
            ).should.be.fulfilled;

            writerBalance = await token.balanceOf.call(writer, {from: writer});
            user1Balance = await token.balanceOf.call(user1, {from: user1});
            user2Balance = await token.balanceOf.call(user2, {from: user2});

            writerBalance.should.be.bignumber.equal(airdropAmount);
            user1Balance.should.be.bignumber.equal(airdropAmount);
            user2Balance.should.be.bignumber.equal(airdropAmount);

            let _isRegisterd = await accountManager.isRegistered.call("writer", {from:writer});
            _isRegisterd.should.be.equal(true);
            _isRegisterd = await accountManager.isRegistered.call("user1", {from:user1});
            _isRegisterd.should.be.equal(true);
            _isRegisterd = await accountManager.isRegistered.call("user2", {from:user2});
            _isRegisterd.should.be.equal(true);
        });

        it("Transfer initial deposit.", async () => {
            const _toAddress = await council.getContentsManager.call({from: writer});

            await token.approveAndCall(_toAddress, initialDeposit, "", {from: writer});

            const _initialDeposit = await apiContents.getInitialDeposit.call(writer, {from: writer});

            _initialDeposit.should.be.bignumber.equal(initialDeposit);
        });

        it("Add contents.", async () => {
            await apiContents.addContents(record, 10 * decimals, {from:writer});

            const _contentsAddress = await apiContents.getWriterContentsAddress.call(writer, {from:writer});
            _contentsAddress.length.should.be.equal(1);

            const _contentsRecords = await apiContents.getContentsRecord.call(_contentsAddress, {from: writer});
            const _record = JSON.parse(web3.toUtf8(_contentsRecords[1]));

            _record.length.should.be.equal(1);
            _record[0].title.should.be.equal('권짱님의 스트레스!!');
        });

        it("Update contents record.", async () => {
            const _contentsDetail = await apiContents.getWriterContentsList.call(writer, {from: writer});
            const _contentsAddress = _contentsDetail[0];
            const _originalRecord = JSON.parse(web3.toUtf8(_contentsDetail[1]));
            _contentsAddress.length.should.be.equal(1);
            _originalRecord[0].title.should.be.equal('권짱님의 스트레스!!');

            await apiContents.updateContent(_contentsAddress[0], updateRecord, marketerRate, {from:writer});

            const _updateContentsDetail = await apiContents.getWriterContentsList.call(writer, {from: writer});
            const _updateContentsAddress = _updateContentsDetail[0];
            const _updateRecord = JSON.parse(web3.toUtf8(_updateContentsDetail[1]));

            _updateContentsAddress[0].should.be.equal(_contentsAddress[0]);
            _updateRecord[0].title.should.be.equal('권짱님의 업그레이드 스트레스!!');
        });

        it("Add episode.", async () => {
            const episodePrice = 10 * decimals;

            const _contentsDetail = await apiContents.getWriterContentsList.call(writer, {from: writer});
            const _contentsAddress = _contentsDetail[0][0];
            
            await apiContents.addEpisode(_contentsAddress, episode, imageUrl, episodePrice, {from: owner}).should.be.rejected;
            await apiContents.addEpisode(_contentsAddress, episode, imageUrl, episodePrice, {from: writer}).should.be.fulfilled;

            const _episodeDetail = await apiContents.getEpisodeFullList(_contentsAddress, {from: writer});
            const _episodeRecord = JSON.parse(web3.toUtf8(_episodeDetail[0]));
            const _episodePrice = _episodeDetail[1];
            const _episodeBuyCount = _episodeDetail[2];
            const _episodePurchased = _episodeDetail[3];

            _episodePrice.length.should.be.equal(_episodeBuyCount.length);
            _episodeBuyCount.length.should.be.equal(_episodePurchased.length);
            
            _episodeRecord[0].title.should.be.equal('똥쟁이님의 신발 구매???????');
            episodePrice.should.be.equal(_episodePrice[0].toNumber());
            _episodeBuyCount[0].toNumber().should.be.equal(0);
            _episodePurchased[0].should.be.equal(true);
        });

        it("Update episode.", async () => {
            const episodePrice = 10 * decimals;

            const _contentsDetail = await apiContents.getWriterContentsList.call(writer, {from: writer});
            const _contentsAddress = _contentsDetail[0][0];

            await apiContents.updateEpisode(_contentsAddress, 0, updateEpisode, imageUrl, episodePrice, {from: owner}).should.be.rejected;
            await apiContents.updateEpisode(_contentsAddress, 0, updateEpisode, imageUrl, episodePrice, {from: writer}).should.be.fulfilled;

            const _episodeDetail = await apiContents.getEpisodeFullList(_contentsAddress, {from: writer});
            const _episodeRecord = JSON.parse(web3.toUtf8(_episodeDetail[0]));
            const _episodePrice = _episodeDetail[1];
            const _episodeBuyCount = _episodeDetail[2];
            const _episodePurchased = _episodeDetail[3];

            _episodePrice.length.should.be.equal(_episodeBuyCount.length);
            _episodeBuyCount.length.should.be.equal(_episodePurchased.length);

            _episodeRecord[0].title.should.be.equal('똥쟁이님의 조던 11!!!');
        });

        it("Pick count test.", async () => {
            const _contentsDetail = await apiContents.getWriterContentsList.call(writer, {from: writer});
            const _contentsAddress = _contentsDetail[0][0];

            let pickCount = await apiContents.getPickCount(_contentsAddress, {from: owner});
            pickCount.toNumber().should.be.equal(0);

            await apiContents.addPickCount(_contentsAddress, {from: owner});
            pickCount = await apiContents.getPickCount(_contentsAddress, {from: owner});
            pickCount.toNumber().should.be.equal(1);
        });
    });
});
