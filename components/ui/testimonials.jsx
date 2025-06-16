export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16">
          {/* Testimonial 1: Career switch (woman) */}
          <div className="flex flex-col pb-10 sm:pb-16 lg:pb-0 lg:pr-8 xl:pr-20">
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg leading-8 text-gray-900">
                <p>
                  “I used CloudPractitioneer while preparing for the AWS Cloud
                  Practitioner exam. The explanations were easy to understand,
                  and the flashcards helped me stay consistent. After passing, I
                  was able to move into a junior cloud role at my company.”
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <img
                  alt="Cartoon avatar of a woman"
                  src="https://api.dicebear.com/7.x/croodles/svg?seed=Lisa"
                  className="size-14 rounded-full bg-gray-50"
                />
                <div className="text-base">
                  <div className="font-semibold text-gray-900">Lisa Müller</div>
                  <div className="mt-1 text-gray-500">
                    IT Support → Cloud Engineer (Berlin)
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>

          {/* Testimonial 2: Career boost (man) */}
          <div className="flex flex-col border-t border-gray-900/10 pt-10 sm:pt-16 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-20">
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg leading-8 text-gray-900">
                <p>
                  “The practice exams in CloudPractitioneer were very close to
                  the real thing. I passed the AWS exam in under two weeks of
                  preparation. It gave me the confidence to apply for roles I
                  was hesitant about before.”
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <img
                  alt="Cartoon avatar of a man"
                  src="https://api.dicebear.com/7.x/croodles/svg?seed=John"
                  className="size-14 rounded-full bg-gray-50"
                />
                <div className="text-base">
                  <div className="font-semibold text-gray-900">John Davis</div>
                  <div className="mt-1 text-gray-500">
                    Cloud Intern → Associate Cloud Consultant
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>

          {/* Testimonial 3: University student (woman) */}
          <div className="flex flex-col border-t border-gray-900/10 pt-10 lg:col-span-1 lg:pr-8 xl:pr-20">
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg leading-8 text-gray-900">
                <p>
                  “As a computer science student, I needed something lightweight
                  but effective to prepare for my AWS exam. CloudPractitioneer
                  gave me just that — I used the daily review streak feature to
                  stay on track without burnout.”
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <img
                  alt="Cartoon avatar of a woman"
                  src="https://api.dicebear.com/7.x/croodles/svg?seed=Meera"
                  className="size-14 rounded-full bg-gray-50"
                />
                <div className="text-base">
                  <div className="font-semibold text-gray-900">Meera Patel</div>
                  <div className="mt-1 text-gray-500">
                    CS Student, University of Manchester
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>

          {/* Testimonial 4: Self-learner (man) */}
          <div className="flex flex-col border-t border-gray-900/10 pt-10 lg:border-l lg:pl-8 xl:pl-20">
            <figure className="mt-10 flex flex-auto flex-col justify-between">
              <blockquote className="text-lg leading-8 text-gray-900">
                <p>
                  “I didn’t have a tech background, but I wanted to break into
                  cloud computing. This platform helped me grasp the basics
                  without feeling overwhelmed. I passed the Cloud Practitioner
                  exam and just started my first cloud-related job.”
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-x-6">
                <img
                  alt="Cartoon avatar of a man"
                  src="https://api.dicebear.com/7.x/croodles/svg?seed=Alex"
                  className="size-14 rounded-full bg-gray-50"
                />
                <div className="text-base">
                  <div className="font-semibold text-gray-900">Alex N.</div>
                  <div className="mt-1 text-gray-500">
                    Career Changer, Entry-Level Cloud Tech
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
