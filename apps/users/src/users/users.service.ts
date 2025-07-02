import { NotFoundError, ValidationError } from "@bms/shared/errors";
import { Pagination, PaginationParam } from "@bms/shared/types";
import { ProfileRepository } from "./profile.repository";
import {
  NewUser,
  Profile,
  UpdateProfile,
  UpdateUser,
  User,
  UserId,
} from "./users.entities";
import { UserRepository } from "./users.repository";

export class UserService {
  constructor(
    private readonly userRepo: UserRepository = new UserRepository(),
    private readonly profileRepo: ProfileRepository = new ProfileRepository()
  ) {}

  async getAll(
    data: PaginationParam
  ): Promise<{ data: User[]; pagination: Pagination }> {
    const { page = 1, limit = 10 } = data;
    const offset = limit * (page - 1);

    const totalItems = await this.userRepo.count();
    const totalPages = Math.ceil(totalItems / limit);

    if (page > 1 && page > totalPages)
      throw new ValidationError("Page query is over exceeded!", [
        {
          code: "invalid_input",
          message: "Page is invalid!",
          path: ["page"],
        },
      ]);

    const pagination: Pagination = {
      limit,
      totalItems,
      totalPages,
      page: data.page!,
      ...(page < totalPages && { next: page + 1 }),
      ...(page > 1 && { prev: page - 1 }),
    };

    const userData = await this.userRepo.getAll({ offset, limit });

    return {
      data: userData.map(this.toUser),
      pagination,
    };
  }

  async getSingle(id: UserId): Promise<User> {
    const user = await this.userRepo.findById(id);

    if (!user) throw new NotFoundError();

    return this.toUser(user!);
  }

  async create(data: NewUser): Promise<User> {
    const user = await this.userRepo.create(data);

    // create profile
    await this.profileRepo.create({
      fullname: data.fullname,
      user: user.id,
    });

    return this.toUser(user);
  }

  async update(id: UserId, data: UpdateUser): Promise<User> {
    const findUser = await this.userRepo.findById(id);

    if (!findUser) throw new NotFoundError();

    if (Object.keys(data).length <= 0) return this.toUser(findUser);

    const updatedData = await this.userRepo.update(id, data);

    return this.toUser(updatedData);
  }

  async remove(id: UserId): Promise<void> {
    const findUser = await this.userRepo.findById(id);
    if (!findUser) throw new NotFoundError();

    await this.userRepo.update(id, { deletedAt: new Date() });
  }

  async verify(id: UserId): Promise<User> {
    const findUser = await this.userRepo.findById(id);
    if (!findUser) throw new NotFoundError();

    const updatedData = await this.userRepo.update(id, { status: "progress" });

    // todo auth api to update auth db

    return this.toUser(updatedData);
  }

  async promote(id: UserId): Promise<User> {
    const findUser = await this.userRepo.findById(id);
    if (!findUser) throw new NotFoundError();

    const updatedData = await this.userRepo.update(id, {});

    return this.toUser(updatedData);
  }

  async demote(id: UserId): Promise<User> {
    const findUser = await this.userRepo.findById(id);
    if (!findUser) throw new NotFoundError();

    const updatedData = await this.userRepo.update(id, {});

    return this.toUser(updatedData);
  }

  async getProfile(id: UserId): Promise<Profile> {
    const findUser = await this.userRepo.findById(id);
    if (!findUser) throw new NotFoundError();

    const profileData = await this.profileRepo.findByUserId(id);

    return this.toProfile(profileData);
  }

  async updateProfile(id: UserId, data: UpdateProfile): Promise<Profile> {
    const findProfile = await this.profileRepo.findByUserId(id);

    if (!findProfile) throw new NotFoundError();

    if (Object.keys(data).length <= 0) return this.toProfile(findProfile);

    const updatedProfile = await this.profileRepo.update(
      findProfile.id as any,
      data
    );

    return this.toProfile(updatedProfile);
  }

  private toUser(user: User): User {
    return {
      id: user.id,
      blood: user.blood,
      email: user.email,
      status: user.status,
      phonNo: user.phonNo,
      lastDonation: user.lastDonation,
      createdAt: user.createdAt,
    };
  }

  private toProfile(profile: Profile): Profile {
    return {
      id: profile.id,
      fullname: profile.fullname,
      fatherName: profile.fatherName,
      motherName: profile.motherName,
      address: profile.address,
      upzila: profile.motherName,
      zila: profile.zila,
      createdAt: profile.createdAt,
    };
  }
}
